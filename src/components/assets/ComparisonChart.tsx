"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import type { AssetDefinition, DataPoint, TimeRange } from "@/types/assets";

interface AssetWithData {
  def: AssetDefinition;
  data: DataPoint[];
  cachedAt?: string;
  stale?: boolean;
  static?: boolean;
}

interface ComparisonChartProps {
  assets: AssetWithData[];
  loadingSymbols: Set<string>;
  range?: TimeRange;
}

function mergeDataByDate(assets: AssetWithData[]): Record<string, unknown>[] {
  const dateMap: Record<string, Record<string, unknown>> = {};

  assets.forEach((asset) => {
    asset.data.forEach((point) => {
      const shortDate = point.date.slice(0, 7); // YYYY-MM
      if (!dateMap[shortDate]) dateMap[shortDate] = { date: shortDate };
      dateMap[shortDate][asset.def.symbol] = point.pct_change;
    });
  });

  return Object.values(dateMap).sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );
}

// ── Statistics calculations ───────────────────────────────────────────────────

function calcStats(data: DataPoint[], range: TimeRange) {
  if (data.length < 2) return null;

  const years = { "1y": 1, "3y": 3, "5y": 5, "10y": 10 }[range] ?? 5;
  const values = data.map((d) => d.value);
  const start = values[0];
  const end = values[values.length - 1];
  const totalReturn = ((end - start) / start) * 100;

  // CAGR
  const cagr = (Math.pow(end / start, 1 / years) - 1) * 100;

  // Max Drawdown
  let peak = values[0];
  let maxDD = 0;
  for (const v of values) {
    if (v > peak) peak = v;
    const dd = (peak - v) / peak;
    if (dd > maxDD) maxDD = dd;
  }
  const maxDrawdown = maxDD * 100;

  // Annualised volatility (std dev of period returns × sqrt(periods_per_year))
  const returns: number[] = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] > 0) returns.push((values[i] - values[i - 1]) / values[i - 1]);
  }
  const mean = returns.reduce((s, r) => s + r, 0) / (returns.length || 1);
  const variance = returns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / (returns.length || 1);
  const periodsPerYear = range === "1y" ? 52 : 12;
  const volatility = Math.sqrt(variance * periodsPerYear) * 100;

  // Sharpe Ratio (risk-free rate 4.5% USD, approx)
  const rfRate = 4.5;
  const sharpe = volatility > 0 ? (cagr - rfRate) / volatility : 0;

  return {
    totalReturn: Math.round(totalReturn * 10) / 10,
    cagr: Math.round(cagr * 10) / 10,
    maxDrawdown: Math.round(maxDrawdown * 10) / 10,
    volatility: Math.round(volatility * 10) / 10,
    sharpe: Math.round(sharpe * 100) / 100,
    currentValue: end,
  };
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-gray-400 text-xs mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300">{entry.name}</span>
          </div>
          <span className={`font-bold ${entry.value >= 0 ? "text-green-400" : "text-red-400"}`}>
            {entry.value >= 0 ? "+" : ""}{entry.value?.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Stats row ─────────────────────────────────────────────────────────────────

function StatCell({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  const color = positive === undefined ? "text-gray-200"
    : positive ? "text-green-400" : "text-red-400";
  return (
    <div className="text-center">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-xs font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function DataBadge({ asset }: { asset: AssetWithData }) {
  if (asset.stale) return (
    <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded-full">cached</span>
  );
  if ((asset as any).static) return (
    <span className="text-[9px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded-full">static</span>
  );
  return (
    <span className="text-[9px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full">live</span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ComparisonChart({ assets, loadingSymbols, range = "5y" }: ComparisonChartProps) {
  const assetsWithData = assets.filter((a) => a.data.length > 0);
  const loadingList = assets.filter((a) => loadingSymbols.has(a.def.symbol));

  if (loadingList.length > 0 && assetsWithData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="animate-spin text-3xl mb-3">⟳</div>
          <p className="text-sm">Loading {loadingList.map((a) => a.def.name).join(", ")}…</p>
        </div>
      </div>
    );
  }

  if (assetsWithData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-600">
        <p className="text-sm">No data available for the selected assets</p>
      </div>
    );
  }

  const chartData = mergeDataByDate(assetsWithData);
  const statsMap = Object.fromEntries(
    assetsWithData.map((a) => [a.def.symbol, calcStats(a.data, range)])
  );

  return (
    <div className="space-y-6">
      {loadingList.length > 0 && (
        <p className="text-xs text-gray-500 animate-pulse">
          Loading {loadingList.map((a) => a.def.name).join(", ")}…
        </p>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            tickFormatter={(v) => String(v).slice(0, 4)}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 11 }}
            tickFormatter={(v) => `${v >= 0 ? "+" : ""}${v}%`}
            domain={["auto", "auto"]}
          />
          <ReferenceLine y={0} stroke="#374151" strokeDasharray="4 4" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: "16px" }}
            formatter={(value) => <span style={{ color: "#d1d5db", fontSize: "12px" }}>{value}</span>}
          />
          {assetsWithData.map((asset) => (
            <Line
              key={asset.def.symbol}
              type="monotone"
              dataKey={asset.def.symbol}
              name={asset.def.name}
              stroke={asset.def.logoColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Statistics table */}
      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <div className="grid bg-gray-800/40 px-4 py-2 text-[10px] text-gray-500 uppercase tracking-wider"
          style={{ gridTemplateColumns: `180px repeat(5, 1fr)` }}>
          <span>Asset</span>
          <span className="text-center">Total Return</span>
          <span className="text-center">CAGR</span>
          <span className="text-center">Max Drawdown</span>
          <span className="text-center">Volatility</span>
          <span className="text-center">Sharpe</span>
        </div>

        {assetsWithData.map((asset, i) => {
          const s = statsMap[asset.def.symbol];
          const borderClass = i > 0 ? "border-t border-gray-800" : "";
          return (
            <div key={asset.def.symbol}
              className={`grid items-center px-4 py-3 ${borderClass}`}
              style={{ gridTemplateColumns: `180px repeat(5, 1fr)` }}>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: asset.def.logoColor }} />
                <span className="text-xs text-gray-200 font-medium truncate">{asset.def.name}</span>
                <DataBadge asset={asset} />
              </div>
              {s ? (
                <>
                  <StatCell label="" value={`${s.totalReturn >= 0 ? "+" : ""}${s.totalReturn}%`}
                    positive={s.totalReturn >= 0} />
                  <StatCell label="" value={`${s.cagr >= 0 ? "+" : ""}${s.cagr}%`}
                    positive={s.cagr >= 0} />
                  <StatCell label="" value={`-${s.maxDrawdown}%`} positive={false} />
                  <StatCell label="" value={`${s.volatility}%`} />
                  <StatCell label="" value={s.sharpe.toFixed(2)}
                    positive={s.sharpe >= 1} />
                </>
              ) : (
                <span className="col-span-5 text-xs text-gray-600 text-center">Insufficient data</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footnote */}
      <p className="text-[10px] text-gray-600 flex items-center justify-between">
        <span>CAGR = Compound Annual Growth Rate · Sharpe = (CAGR − 4.5% RFR) / Volatility · Not investment advice</span>
        {assetsWithData[0]?.cachedAt && (
          <span>Data as of {new Date(assetsWithData[0].cachedAt).toLocaleString()}</span>
        )}
      </p>
    </div>
  );
}
