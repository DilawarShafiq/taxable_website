"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import type { AssetDefinition, DataPoint } from "@/types/assets";

interface AssetWithData {
  def: AssetDefinition;
  data: DataPoint[];
  cachedAt?: string;
}

interface ComparisonChartProps {
  assets: AssetWithData[];
  loadingSymbols: Set<string>;
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

export function ComparisonChart({ assets, loadingSymbols }: ComparisonChartProps) {
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

  return (
    <div>
      {loadingList.length > 0 && (
        <p className="text-xs text-gray-500 mb-3 animate-pulse">
          Loading {loadingList.map((a) => a.def.name).join(", ")}…
        </p>
      )}

      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            tickFormatter={(v) => {
              const [year] = String(v).split("-");
              return year;
            }}
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

      {assetsWithData[0]?.cachedAt && (
        <p className="text-[10px] text-gray-600 mt-2 text-right">
          Data as of {new Date(assetsWithData[0].cachedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
