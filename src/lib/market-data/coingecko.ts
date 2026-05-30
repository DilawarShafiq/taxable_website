import type { DataPoint } from "@/types/database";

const COIN_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
};

const RANGE_DAYS: Record<string, number> = {
  "1y": 365,
  "3y": 1095,
  "5y": 1825,
  "10y": 3650,
};

export async function fetchCryptoHistory(symbol: string, range: string): Promise<DataPoint[]> {
  const coinId = COIN_IDS[symbol];
  if (!coinId) throw new Error(`Unknown crypto symbol: ${symbol}`);

  const days = RANGE_DAYS[range] ?? 365;
  const apiKey = process.env.COINGECKO_API_KEY;

  // Use weekly interval for > 3 months (CoinGecko auto-aggregates for long ranges)
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;

  const headers: Record<string, string> = {
    "Accept": "application/json",
  };
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

  const res = await fetch(url, {
    headers,
    next: { revalidate: 900 },
  });

  if (res.status === 429) {
    // Rate limited — try the pro endpoint if key exists
    throw new Error("CoinGecko rate limit hit");
  }

  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

  const json = await res.json() as { prices: [number, number][] };
  const prices = json.prices;
  if (!prices.length) return [];

  // Downsample to monthly to keep data manageable
  const monthly = sampleMonthly(prices);
  if (!monthly.length) return [];

  const startValue = monthly[0][1];
  return monthly.map(([timestamp, value]) => ({
    date: new Date(timestamp).toISOString().split("T")[0],
    value: Math.round(value * 100) / 100,
    pct_change: startValue > 0 ? Math.round(((value - startValue) / startValue) * 10000) / 100 : 0,
  }));
}

// Keep only the last data point per calendar month
function sampleMonthly(prices: [number, number][]): [number, number][] {
  const byMonth: Map<string, [number, number]> = new Map();
  for (const [ts, price] of prices) {
    const key = new Date(ts).toISOString().slice(0, 7); // YYYY-MM
    byMonth.set(key, [ts, price]);
  }
  return Array.from(byMonth.values()).sort((a, b) => a[0] - b[0]);
}
