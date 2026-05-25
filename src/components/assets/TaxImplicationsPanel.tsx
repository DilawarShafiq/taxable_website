"use client";

import type { AssetDefinition } from "@/types/assets";
import type { Jurisdiction, AssetType } from "@/types/database";

// Inline tax summaries to avoid JSON import issues in client components
const TAX_SUMMARIES: Record<Jurisdiction, Record<AssetType, { rate: string; notes: string; authority: string; url: string }>> = {
  usa: {
    stock: { rate: "0% / 15% / 20% (long-term)", notes: "Short-term gains taxed as ordinary income (up to 37%). Wash-sale rule applies. NIIT 3.8% for high earners.", authority: "IRS", url: "https://www.irs.gov/taxtopics/tc409" },
    crypto: { rate: "0% / 15% / 20% (long-term)", notes: "Every disposal is taxable. Crypto-to-crypto swaps are taxable events. No wash-sale rule currently.", authority: "IRS", url: "https://www.irs.gov/businesses/small-businesses-self-employed/virtual-currencies" },
    real_estate: { rate: "0% / 15% / 20%", notes: "Primary residence exclusion: $250k/$500k MFJ. Depreciation recapture at 25%. 1031 Exchange available.", authority: "IRS", url: "https://www.irs.gov/taxtopics/tc701" },
  },
  uk: {
    stock: { rate: "18% (basic) / 24% (higher)", notes: "Annual exempt amount: £3,000. No distinction between short/long-term. ISA wrapper is CGT-exempt.", authority: "HMRC", url: "https://www.gov.uk/capital-gains-tax" },
    crypto: { rate: "18% (basic) / 24% (higher)", notes: "HMRC treats crypto as capital asset. Section 104 pool applies. Same-day and 30-day rules.", authority: "HMRC", url: "https://www.gov.uk/guidance/check-if-you-need-to-pay-tax-when-you-receive-cryptoassets" },
    real_estate: { rate: "18% (basic) / 24% (higher)", notes: "Primary Residence Relief (PRR) exempts main home. 60-day reporting for UK residential disposals.", authority: "HMRC", url: "https://www.gov.uk/capital-gains-tax/property" },
  },
  saudi: {
    stock: { rate: "No personal CGT", notes: "Saudi/GCC nationals: no personal CGT. Foreign investors in Tadawul: CIT exemption on listed securities (FINI). Dividend WHT: 5%.", authority: "ZATCA", url: "https://zatca.gov.sa" },
    crypto: { rate: "Unregulated (seek advice)", notes: "No formal crypto tax law. May be treated under general income rules. SAMA does not recognise crypto.", authority: "ZATCA", url: "https://zatca.gov.sa" },
    real_estate: { rate: "RETT: 5% on transaction", notes: "Real Estate Transaction Tax paid by buyer. Exemption on first home up to SAR 1m. No personal CGT.", authority: "ZATCA", url: "https://zatca.gov.sa" },
  },
  pakistan: {
    stock: { rate: "15% < 1yr / 10% > 2yrs (filer)", notes: "Non-filers pay higher rates. Dividend WHT: 15% (final). NCCPL collects CGT at source from PSX.", authority: "FBR", url: "https://fbr.gov.pk" },
    crypto: { rate: "Not specifically regulated", notes: "May be taxed as 'other income' at slab rates (up to 35%). Seek specialist advice.", authority: "FBR", url: "https://fbr.gov.pk" },
    real_estate: { rate: "15% < 1yr → 0% > 4yrs (filer)", notes: "Section 7E deemed income: 1% of FBR value annually. Non-filers pay 3% WHT on purchase.", authority: "FBR", url: "https://fbr.gov.pk" },
  },
};

const JURISDICTION_NAMES: Record<Jurisdiction, string> = {
  usa: "🇺🇸 United States", uk: "🇬🇧 United Kingdom",
  saudi: "🇸🇦 Saudi Arabia", pakistan: "🇵🇰 Pakistan",
};

interface TaxImplicationsPanelProps {
  selected: AssetDefinition[];
  jurisdiction: Jurisdiction;
}

export function TaxImplicationsPanel({ selected, jurisdiction }: TaxImplicationsPanelProps) {
  const rules = TAX_SUMMARIES[jurisdiction];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Tax Implications</h2>
          <p className="text-sm text-gray-500">{JURISDICTION_NAMES[jurisdiction]}</p>
        </div>
        <a href="/contact" className="text-xs text-indigo-400 hover:underline">
          Get personalised tax advice →
        </a>
      </div>

      <div className="space-y-4">
        {selected.map((asset) => {
          const rule = rules[asset.type];
          return (
            <div key={asset.symbol}
              className="flex items-start gap-4 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <span className="h-3 w-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: asset.logoColor }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <p className="font-medium text-white text-sm">{asset.name}</p>
                  <span className="text-xs font-bold text-indigo-300 bg-indigo-900/40 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {rule.rate}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{rule.notes}</p>
                <a href={rule.url} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-indigo-500 hover:underline mt-1 inline-block">
                  {rule.authority} guidance →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-600 mt-4 border-t border-gray-800 pt-4">
        Tax rates shown are for general guidance only. Individual circumstances vary.{" "}
        <a href="/contact" className="text-indigo-500 hover:underline">Consult our tax team</a> for personalised advice.
      </p>
    </div>
  );
}
