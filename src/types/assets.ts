import type { AssetType, DataPoint, Jurisdiction } from "./database";

export type { AssetType, DataPoint };

export type TimeRange = "1y" | "3y" | "5y" | "10y";

export interface AssetDefinition {
  symbol: string;
  name: string;
  type: AssetType;
  description: string;
  logoColor: string;
}

export const ASSET_DEFINITIONS: AssetDefinition[] = [
  // Stocks
  { symbol: "^GSPC", name: "S&P 500", type: "stock", description: "US large-cap equities", logoColor: "#3B82F6" },
  { symbol: "^FTSE", name: "FTSE 100", type: "stock", description: "UK top 100 companies", logoColor: "#1D4ED8" },
  { symbol: "^KSE", name: "PSX 100", type: "stock", description: "Pakistan Stock Exchange (formerly KSE-100)", logoColor: "#15803D" },
  { symbol: "^TASI", name: "Tadawul (TASI)", type: "stock", description: "Saudi Stock Exchange", logoColor: "#B45309" },
  { symbol: "^DFMGI", name: "DFM General (Dubai)", type: "stock", description: "Dubai Financial Market Index", logoColor: "#0369A1" },
  { symbol: "^NDX", name: "NASDAQ-100", type: "stock", description: "US technology index", logoColor: "#7C3AED" },
  // Crypto
  { symbol: "BTC", name: "Bitcoin", type: "crypto", description: "Digital gold", logoColor: "#F59E0B" },
  { symbol: "ETH", name: "Ethereum", type: "crypto", description: "Smart contracts platform", logoColor: "#6366F1" },
  { symbol: "BNB", name: "BNB", type: "crypto", description: "Binance ecosystem token", logoColor: "#EAB308" },
  { symbol: "SOL", name: "Solana", type: "crypto", description: "High-speed blockchain", logoColor: "#8B5CF6" },
  // Real Estate
  { symbol: "RE_US", name: "US Real Estate", type: "real_estate", description: "Case-Shiller National HPI", logoColor: "#0891B2" },
  { symbol: "RE_UK", name: "UK Real Estate", type: "real_estate", description: "ONS House Price Index", logoColor: "#BE185D" },
  { symbol: "RE_SA", name: "Saudi Real Estate", type: "real_estate", description: "Kingdom property index", logoColor: "#065F46" },
  { symbol: "RE_PK", name: "Pakistan Real Estate", type: "real_estate", description: "Urban property index", logoColor: "#92400E" },
  { symbol: "RE_AE", name: "UAE Real Estate", type: "real_estate", description: "Dubai property price index (DLD)", logoColor: "#D97706" },
];

export interface AssetForecastOutlook {
  low_pct: number;
  mid_pct: number;
  high_pct: number;
}

export interface AssetForecastItem {
  symbol: string;
  name: string;
  current_context: string;
  outlook_1yr: AssetForecastOutlook;
  outlook_3yr: AssetForecastOutlook;
  outlook_5yr: AssetForecastOutlook;
  key_risks: string[];
  key_tailwinds: string[];
  narrative: string;
}

export interface ForecastResponse {
  summary: string;
  assets: AssetForecastItem[];
  comparison_insight: string;
  tax_reminder: string;
  disclaimer: string;
  generated_at: string;
}

export interface TaxRule {
  annual_exempt_usd: number | null;
  short_term_rate_pct: number | null;
  long_term_rate_pct: number | null;
  holding_period_threshold_days: number | null;
  special_rules: string[];
  filing_requirement: string;
}

export interface JurisdictionTaxRules {
  jurisdiction: Jurisdiction;
  year: number;
  stock: TaxRule;
  crypto: TaxRule;
  real_estate: TaxRule;
  notes: string;
  authority: string;
  authority_url: string;
}
