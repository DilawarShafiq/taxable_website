"use client";

import { useState } from "react";
import type { AssetDefinition } from "@/types/assets";

interface AssetPickerProps {
  selected: AssetDefinition[];
  onSelect: (asset: AssetDefinition) => void;
  assets: AssetDefinition[];
  maxSelect: number;
}

const TABS = ["All", "Stocks", "Crypto", "Real Estate"] as const;
type Tab = typeof TABS[number];

const TYPE_MAP: Record<Tab, string | null> = {
  All: null,
  Stocks: "stock",
  Crypto: "crypto",
  "Real Estate": "real_estate",
};

export function AssetPicker({ selected, onSelect, assets, maxSelect }: AssetPickerProps) {
  const [tab, setTab] = useState<Tab>("All");

  const filtered = tab === "All" ? assets : assets.filter((a) => a.type === TYPE_MAP[tab]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-white">Select Assets to Compare</h2>
        <span className="text-xs text-gray-500">{selected.length} / {maxSelect} selected</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${tab === t ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map((asset) => (
            <button key={asset.symbol} onClick={() => onSelect(asset)}
              className="flex items-center gap-1.5 bg-indigo-900/60 text-indigo-300 border border-indigo-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-900/40 hover:text-red-300 hover:border-red-700 transition">
              <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: asset.logoColor }} />
              {asset.name}
              <span className="ml-1 opacity-60">×</span>
            </button>
          ))}
        </div>
      )}

      {/* Asset grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {filtered.map((asset) => {
          const isSelected = !!selected.find((a) => a.symbol === asset.symbol);
          const isDisabled = !isSelected && selected.length >= maxSelect;
          return (
            <button
              key={asset.symbol}
              onClick={() => !isDisabled && onSelect(asset)}
              disabled={isDisabled}
              className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition ${
                isSelected
                  ? "bg-indigo-900/40 border-indigo-600"
                  : isDisabled
                  ? "border-gray-800 opacity-40 cursor-not-allowed"
                  : "border-gray-800 hover:border-gray-600 bg-gray-800/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: asset.logoColor }} />
                <span className="text-xs font-bold text-gray-300">{asset.symbol}</span>
                {isSelected && (
                  <span className="ml-auto h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">✓</span>
                )}
              </div>
              <p className="text-xs font-medium text-white leading-tight">{asset.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{asset.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
