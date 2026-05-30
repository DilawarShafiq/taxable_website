/**
 * POST /api/assets/refresh
 *
 * Triggers the agentic data refresh for all asset types.
 * Called by the Vercel cron job weekly, or manually by admin staff.
 *
 * Protected by CRON_SECRET env var.
 */

import { NextRequest, NextResponse } from "next/server";
import { agenticFetchRealEstateData } from "@/lib/market-data/agentic-scraper";
import { fetchStockHistory } from "@/lib/market-data/alpha-vantage";
import { fetchCryptoHistory } from "@/lib/market-data/coingecko";
import { upsertAssetData } from "@/lib/market-data/cache";

const STOCK_SYMBOLS = ["^GSPC", "^FTSE", "^NDX", "^KSE", "^TASI", "^DFMGI"];
const CRYPTO_SYMBOLS = ["BTC", "ETH", "BNB", "SOL", "XRP"];
const RANGES = ["1y", "3y", "5y", "10y"];

type RefreshResult = {
  symbol: string;
  range: string;
  status: "ok" | "error";
  points?: number;
  error?: string;
};

export async function POST(req: NextRequest) {
  // Verify cron secret (also allows admin staff to trigger manually)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: RefreshResult[] = [];
  const body = await req.json().catch(() => ({}));
  const onlySymbol: string | undefined = body.symbol;

  // ── Pakistan, Saudi & UAE real estate (agentic) ─────────────────────────
  for (const symbol of ["RE_PK", "RE_SA", "RE_AE"] as const) {
    if (onlySymbol && onlySymbol !== symbol) continue;
    try {
      const data = await agenticFetchRealEstateData(symbol);
      if (data.length > 0) {
        // Store under all ranges (the data covers the full history)
        for (const range of RANGES) {
          await upsertAssetData(symbol, range, "real_estate", data, "agentic");
        }
        results.push({ symbol, range: "all", status: "ok", points: data.length });
      } else {
        results.push({ symbol, range: "all", status: "error", error: "No data returned" });
      }
    } catch (err) {
      results.push({ symbol, range: "all", status: "error", error: String(err) });
    }
  }

  // ── Stocks (Yahoo Finance) ──────────────────────────────────────────────
  for (const symbol of STOCK_SYMBOLS) {
    if (onlySymbol && onlySymbol !== symbol) continue;
    for (const range of RANGES) {
      try {
        const data = await fetchStockHistory(symbol, range);
        if (data.length > 0) {
          await upsertAssetData(symbol, range, "stock", data, "yahoo_finance");
          results.push({ symbol, range, status: "ok", points: data.length });
        }
      } catch (err) {
        results.push({ symbol, range, status: "error", error: String(err) });
      }
    }
  }

  // ── Crypto (CoinGecko) ──────────────────────────────────────────────────
  for (const symbol of CRYPTO_SYMBOLS) {
    if (onlySymbol && onlySymbol !== symbol) continue;
    for (const range of RANGES) {
      try {
        const data = await fetchCryptoHistory(symbol, range);
        if (data.length > 0) {
          await upsertAssetData(symbol, range, "crypto", data, "coingecko");
          results.push({ symbol, range, status: "ok", points: data.length });
        }
      } catch (err) {
        results.push({ symbol, range, status: "error", error: String(err) });
      }
    }
  }

  const ok = results.filter((r) => r.status === "ok").length;
  const failed = results.filter((r) => r.status === "error").length;

  return NextResponse.json({ refreshed: ok, failed, results });
}

// Vercel cron handler — called by vercel.json schedule
export async function GET(req: NextRequest) {
  // Vercel cron sends Authorization: Bearer <CRON_SECRET>
  return POST(req);
}
