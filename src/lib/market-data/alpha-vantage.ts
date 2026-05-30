import type { DataPoint } from "@/types/database";

// Yahoo Finance chart API — free, no key required, real-time data
const YF_RANGE: Record<string, string> = {
  "1y": "1y",
  "3y": "3y",
  "5y": "5y",
  "10y": "10y",
};

// Internal symbol → Yahoo Finance symbol mapping
// Verified live: ^TASI.SR and DFMGI.AE return real data; ^KSE returns empty (no YF support)
const YF_SYMBOL_MAP: Record<string, string> = {
  "^TASI":  "^TASI.SR",   // Tadawul All Shares — confirmed working
  "^DFMGI": "DFMGI.AE",   // DFM General Index — confirmed working
};

// Use weekly for 1y (gives ~52 points vs ~12 monthly), monthly for longer ranges
const YF_INTERVAL: Record<string, string> = {
  "1y": "1wk",
  "3y": "1mo",
  "5y": "1mo",
  "10y": "1mo",
};

// Symbols Yahoo Finance doesn't serve — skip live fetch, use static fallback
const YF_UNSUPPORTED = new Set(["^KSE"]);

export async function fetchStockHistory(symbol: string, range: string): Promise<DataPoint[]> {
  if (YF_UNSUPPORTED.has(symbol)) {
    throw new Error(`${symbol} not supported by Yahoo Finance — use static fallback`);
  }

  const yfSymbol = YF_SYMBOL_MAP[symbol] ?? symbol;
  const yRange = YF_RANGE[range] ?? "5y";
  const interval = YF_INTERVAL[range] ?? "1mo";
  const encoded = encodeURIComponent(yfSymbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?range=${yRange}&interval=${interval}&events=history`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const res2 = await fetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${encoded}?range=${yRange}&interval=${interval}`,
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 3600 } }
    );
    if (!res2.ok) throw new Error(`Yahoo Finance API error: ${res.status}`);
    return parseYahooResponse(await res2.json());
  }

  const data = parseYahooResponse(await res.json());
  if (!data.length) throw new Error(`Yahoo Finance returned empty data for ${yfSymbol}`);
  return data;
}

function parseYahooResponse(json: unknown): DataPoint[] {
  const result = (json as any)?.chart?.result?.[0];
  if (!result) return [];

  const timestamps: number[] = result.timestamp ?? [];
  const closes: number[] =
    result.indicators?.adjclose?.[0]?.adjclose ??
    result.indicators?.quote?.[0]?.close ??
    [];

  if (!timestamps.length || !closes.length) return [];

  const pairs: { date: string; value: number }[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const v = closes[i];
    if (v == null || isNaN(v)) continue;
    const date = new Date(timestamps[i] * 1000).toISOString().split("T")[0];
    pairs.push({ date, value: Math.round(v * 100) / 100 });
  }

  if (!pairs.length) return [];
  const startValue = pairs[0].value;

  return pairs.map((p) => ({
    date: p.date,
    value: p.value,
    pct_change: startValue > 0 ? Math.round(((p.value - startValue) / startValue) * 10000) / 100 : 0,
  }));
}
