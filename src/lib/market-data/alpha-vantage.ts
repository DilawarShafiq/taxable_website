import type { DataPoint } from "@/types/database";

// Maps our symbols to Alpha Vantage tickers
const SYMBOL_MAP: Record<string, string> = {
  "^GSPC": "SPY",   // S&P 500 ETF proxy
  "^FTSE": "ISF.L", // FTSE 100 ETF proxy
  "^NDX":  "QQQ",   // NASDAQ-100 ETF
  "^KSE":  "PAK",   // Pakistan ETF proxy (limited)
  "^TASI": "KSA",   // Saudi ETF proxy
};

const RANGE_MONTHS: Record<string, number> = {
  "1y": 12, "3y": 36, "5y": 60, "10y": 120,
};

export async function fetchStockHistory(symbol: string, range: string): Promise<DataPoint[]> {
  const ticker = SYMBOL_MAP[symbol] ?? symbol;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    console.warn("[alpha-vantage] No API key — returning empty data");
    return [];
  }

  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Alpha Vantage API error: ${res.status}`);

  const json = await res.json() as Record<string, unknown>;
  const series = json["Monthly Adjusted Time Series"] as Record<string, { "5. adjusted close": string }> | undefined;

  if (!series) return [];

  const months = RANGE_MONTHS[range] ?? 12;
  const entries = Object.entries(series)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-months);

  if (!entries.length) return [];
  const startValue = parseFloat(entries[0][1]["5. adjusted close"]);

  return entries.map(([date, values]) => {
    const value = parseFloat(values["5. adjusted close"]);
    return {
      date,
      value: Math.round(value * 100) / 100,
      pct_change: startValue > 0 ? Math.round(((value - startValue) / startValue) * 10000) / 100 : 0,
    };
  });
}
