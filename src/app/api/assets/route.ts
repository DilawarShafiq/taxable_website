import { NextRequest, NextResponse } from "next/server";
import { getCachedAssetData, upsertAssetData } from "@/lib/market-data/cache";
import { fetchCryptoHistory } from "@/lib/market-data/coingecko";
import { fetchStockHistory } from "@/lib/market-data/alpha-vantage";
import { fetchRealEstateHistory } from "@/lib/market-data/real-estate";
import { getStaticStockData } from "@/lib/market-data/static-stocks";
import { ASSET_DEFINITIONS } from "@/types/assets";
import type { AssetType } from "@/types/database";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const range = searchParams.get("range") ?? "5y";

  if (!symbol) {
    return NextResponse.json({ error: "symbol is required" }, { status: 400 });
  }

  const assetDef = ASSET_DEFINITIONS.find((a) => a.symbol === symbol);
  if (!assetDef) {
    return NextResponse.json({ error: "Unknown symbol" }, { status: 404 });
  }

  const assetType: AssetType = assetDef.type;

  // Check DB cache first (avoids hammering external APIs)
  try {
    const cached = await getCachedAssetData(symbol, range, assetType);
    if (cached) {
      return NextResponse.json({
        symbol,
        name: assetDef.name,
        type: assetType,
        range,
        data: cached.data,
        cachedAt: cached.cachedAt,
        fromCache: true,
      });
    }
  } catch {
    // DB unavailable — skip cache, fetch live
  }

  // Fetch live data
  try {
    let dataPoints = [];
    if (assetType === "crypto") {
      dataPoints = await fetchCryptoHistory(symbol, range);
    } else if (assetType === "stock") {
      dataPoints = await fetchStockHistory(symbol, range);
    } else {
      dataPoints = await fetchRealEstateHistory(symbol, range);
    }

    const now = new Date().toISOString();

    // Write to cache in background (don't await — keep response fast)
    if (dataPoints.length > 0) {
      upsertAssetData(symbol, range, assetType, dataPoints, "live").catch(() => {});
    }

    return NextResponse.json({
      symbol,
      name: assetDef.name,
      type: assetType,
      range,
      data: dataPoints,
      cachedAt: now,
      fromCache: false,
    });
  } catch (err) {
    console.error(`[assets] Error fetching ${symbol}:`, err);

    // Stale DB cache
    try {
      const stale = await getCachedAssetData(symbol, range, assetType);
      if (stale) {
        return NextResponse.json({
          symbol, name: assetDef.name, type: assetType, range,
          data: stale.data, cachedAt: stale.cachedAt, fromCache: true, stale: true,
        });
      }
    } catch { /* ignore */ }

    // Static built-in fallback for stocks (always available, no API needed)
    if (assetType === "stock") {
      const staticData = getStaticStockData(symbol, range);
      if (staticData.length > 0) {
        return NextResponse.json({
          symbol, name: assetDef.name, type: assetType, range,
          data: staticData, cachedAt: new Date().toISOString(), fromCache: false, static: true,
        });
      }
    }

    return NextResponse.json({ error: "Failed to fetch asset data" }, { status: 500 });
  }
}
