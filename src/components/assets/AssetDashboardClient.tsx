"use client";

import { useState, useCallback } from "react";
import { AssetPicker } from "./AssetPicker";
import { ComparisonChart } from "./ComparisonChart";
import { ForecastPanel } from "./ForecastPanel";
import { TaxImplicationsPanel } from "./TaxImplicationsPanel";
import { ASSET_DEFINITIONS, type AssetDefinition, type TimeRange, type ForecastResponse } from "@/types/assets";
import type { DataPoint, Jurisdiction } from "@/types/database";

interface AssetData {
  def: AssetDefinition;
  data: DataPoint[];
  cachedAt: string;
  stale?: boolean;
}

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: "1 Year", value: "1y" },
  { label: "3 Years", value: "3y" },
  { label: "5 Years", value: "5y" },
  { label: "10 Years", value: "10y" },
];

export default function AssetDashboardClient() {
  const [selected, setSelected] = useState<AssetDefinition[]>([]);
  const [range, setRange] = useState<TimeRange>("5y");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("uk");
  const [assetData, setAssetData] = useState<Record<string, AssetData>>({});
  const [loadingSymbols, setLoadingSymbols] = useState<Set<string>>(new Set());
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);

  const fetchAsset = useCallback(async (asset: AssetDefinition, r: TimeRange) => {
    const key = `${asset.symbol}|${r}`;
    if (assetData[key]) return;

    setLoadingSymbols((prev) => new Set([...prev, asset.symbol]));
    try {
      const res = await fetch(`/api/assets?symbol=${encodeURIComponent(asset.symbol)}&range=${r}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setAssetData((prev) => ({ ...prev, [key]: { def: asset, data: json.data, cachedAt: json.cachedAt, stale: json.stale, static: json.static } }));
    } catch (err) {
      console.error(`Failed to load ${asset.symbol}:`, err);
    } finally {
      setLoadingSymbols((prev) => { const s = new Set(prev); s.delete(asset.symbol); return s; });
    }
  }, [assetData]);

  const handleSelectAsset = (asset: AssetDefinition) => {
    if (selected.length >= 4 && !selected.find((a) => a.symbol === asset.symbol)) return;
    const isSelected = selected.find((a) => a.symbol === asset.symbol);
    if (isSelected) {
      setSelected((prev) => prev.filter((a) => a.symbol !== asset.symbol));
    } else {
      setSelected((prev) => [...prev, asset]);
      fetchAsset(asset, range);
    }
    setForecast(null);
  };

  const handleRangeChange = (newRange: TimeRange) => {
    setRange(newRange);
    setForecast(null);
    selected.forEach((asset) => {
      const key = `${asset.symbol}|${newRange}`;
      if (!assetData[key]) fetchAsset(asset, newRange);
    });
  };

  const handleGenerateForecast = async () => {
    if (selected.length === 0) return;
    setForecastLoading(true);
    setForecastError(null);
    setForecast(null);

    const assetsWithData = selected.map((asset) => ({
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      data: assetData[`${asset.symbol}|${range}`]?.data ?? [],
    }));

    try {
      const res = await fetch("/api/assets/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assets: assetsWithData, jurisdiction, range }),
      });
      if (!res.ok) throw new Error("Forecast failed");
      const json = await res.json();
      setForecast(json.forecast);
    } catch {
      setForecastError("Failed to generate forecast. Please try again.");
    } finally {
      setForecastLoading(false);
    }
  };

  const currentAssetData = selected.map((asset) => {
    const cached = assetData[`${asset.symbol}|${range}`];
    return {
      def: asset,
      data: cached?.data ?? [],
      cachedAt: cached?.cachedAt ?? "",
      stale: cached?.stale,
      static: (cached as any)?.static,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Asset Comparison Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Compare real estate, crypto & stocks historically — then get AI-powered forecasts and tax implications.
        </p>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Time Range</p>
          <div className="flex gap-1 bg-gray-900 border border-gray-700 rounded-lg p-1">
            {TIME_RANGES.map((t) => (
              <button key={t.value} onClick={() => handleRangeChange(t.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${range === t.value ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Jurisdiction (Tax)</p>
          <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
            className="bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="usa">🇺🇸 USA</option>
            <option value="uk">🇬🇧 UK</option>
            <option value="saudi">🇸🇦 Saudi Arabia</option>
            <option value="pakistan">🇵🇰 Pakistan</option>
            <option value="uae">🇦🇪 UAE</option>
          </select>
        </div>

        {selected.length > 0 && (
          <div className="ml-auto">
            <p className="text-xs text-gray-500 mb-2 opacity-0">.</p>
            <button onClick={handleGenerateForecast} disabled={forecastLoading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
              {forecastLoading ? (
                <><span className="animate-spin">⟳</span> Generating AI Forecast…</>
              ) : (
                <>✨ Generate AI Forecast</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Asset picker */}
      <AssetPicker
        selected={selected}
        onSelect={handleSelectAsset}
        assets={ASSET_DEFINITIONS}
        maxSelect={4}
      />

      {/* Chart */}
      {selected.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Performance Comparison (% Return)</h2>
            {currentAssetData.some((d) => d.stale) && (
              <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                ⚠ Using cached data — live refresh unavailable
              </span>
            )}
          </div>
          <ComparisonChart
            assets={currentAssetData}
            loadingSymbols={loadingSymbols}
            range={range}
          />
        </div>
      )}

      {selected.length === 0 && (
        <div className="bg-gray-900 border border-dashed border-gray-700 rounded-2xl p-16 text-center">
          <p className="text-gray-500 text-lg">Select assets above to start comparing</p>
          <p className="text-gray-600 text-sm mt-2">Up to 4 assets · {range} history · AI forecast available</p>
        </div>
      )}

      {/* Forecast panel */}
      {(forecast || forecastLoading || forecastError) && (
        <ForecastPanel
          forecast={forecast}
          loading={forecastLoading}
          error={forecastError}
          assets={selected}
        />
      )}

      {/* Tax implications */}
      {selected.length > 0 && (
        <TaxImplicationsPanel selected={selected} jurisdiction={jurisdiction} />
      )}
    </div>
  );
}
