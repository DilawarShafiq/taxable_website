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
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=monthly`;

  const res = await fetch(url, {
    headers: process.env.COINGECKO_API_KEY
      ? { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY }
      : {},
    next: { revalidate: 900 }, // 15 min Next.js cache
  });

  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`);

  const json = await res.json() as { prices: [number, number][] };
  const prices = json.prices;

  if (!prices.length) return [];

  const startValue = prices[0][1];
  return prices.map(([timestamp, value]) => ({
    date: new Date(timestamp).toISOString().split("T")[0],
    value: Math.round(value * 100) / 100,
    pct_change: startValue > 0 ? Math.round(((value - startValue) / startValue) * 10000) / 100 : 0,
  }));
}
