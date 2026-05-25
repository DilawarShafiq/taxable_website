"use client";

import type { ForecastResponse, AssetDefinition } from "@/types/assets";

interface ForecastPanelProps {
  forecast: ForecastResponse | null;
  loading: boolean;
  error: string | null;
  assets: AssetDefinition[];
}

export function ForecastPanel({ forecast, loading, error, assets }: ForecastPanelProps) {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center gap-3 text-indigo-400">
          <span className="text-2xl animate-spin">⟳</span>
          <div className="text-left">
            <p className="font-semibold">Claude is analysing your assets…</p>
            <p className="text-sm text-gray-500">Evaluating historical trends, macro context, and jurisdiction factors</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/40 border border-red-800 rounded-2xl p-6">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-8">
      <div className="flex items-start gap-3">
        <span className="text-2xl">✨</span>
        <div>
          <h2 className="text-lg font-semibold text-white">AI Market Forecast</h2>
          <p className="text-gray-400 text-sm mt-1">{forecast.summary}</p>
        </div>
      </div>

      {/* Per-asset forecasts */}
      <div className="grid md:grid-cols-2 gap-4">
        {forecast.assets.map((assetForecast) => {
          const def = assets.find((a) => a.symbol === assetForecast.symbol);
          return (
            <div key={assetForecast.symbol}
              className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                {def && <span className="h-3 w-3 rounded-full" style={{ backgroundColor: def.logoColor }} />}
                <h3 className="font-semibold text-white">{assetForecast.name}</h3>
              </div>

              <p className="text-sm text-gray-400">{assetForecast.current_context}</p>

              {/* Outlook table */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Projected Returns (Base / Bear / Bull)</p>
                <div className="space-y-2">
                  {[
                    { label: "1 Year", data: assetForecast.outlook_1yr },
                    { label: "3 Years", data: assetForecast.outlook_3yr },
                    { label: "5 Years", data: assetForecast.outlook_5yr },
                  ].map(({ label, data }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 w-16">{label}</span>
                      <div className="flex items-center gap-3 text-xs font-medium">
                        <span className="text-red-400">
                          {data.low_pct >= 0 ? "+" : ""}{data.low_pct}%
                        </span>
                        <span className="text-yellow-400 text-sm font-bold">
                          {data.mid_pct >= 0 ? "+" : ""}{data.mid_pct}%
                        </span>
                        <span className="text-green-400">
                          {data.high_pct >= 0 ? "+" : ""}{data.high_pct}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks & tailwinds */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-red-400 mb-1.5 font-medium">Key Risks</p>
                  <ul className="space-y-1">
                    {assetForecast.key_risks.map((r) => (
                      <li key={r} className="text-[11px] text-gray-500 flex items-start gap-1">
                        <span className="text-red-500 mt-0.5">·</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-green-400 mb-1.5 font-medium">Tailwinds</p>
                  <ul className="space-y-1">
                    {assetForecast.key_tailwinds.map((t) => (
                      <li key={t} className="text-[11px] text-gray-500 flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">·</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison insight */}
      {forecast.comparison_insight && (
        <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-xl p-5">
          <p className="text-xs text-indigo-400 font-medium mb-2 uppercase tracking-wider">Comparison Insight</p>
          <p className="text-sm text-gray-300">{forecast.comparison_insight}</p>
        </div>
      )}

      {/* Tax reminder */}
      {forecast.tax_reminder && (
        <div className="bg-yellow-950/30 border border-yellow-800/40 rounded-xl p-4">
          <p className="text-xs text-yellow-500 font-medium mb-1">⚠ Tax Consideration</p>
          <p className="text-xs text-gray-400">{forecast.tax_reminder}</p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-gray-600 border-t border-gray-800 pt-4">
        {forecast.disclaimer}
        {" "}
        <a href="/contact" className="text-indigo-500 hover:underline">
          Speak to our advisors →
        </a>
      </p>
    </div>
  );
}
