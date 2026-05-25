import { NextRequest, NextResponse } from "next/server";
import { getCachedAssetData, upsertAssetData } from "@/lib/market-data/cache";
import { fetchCryptoHistory } from "@/lib/market-data/coingecko";
import { fetchStockHistory } from "@/lib/market-data/alpha-vantage";
import { fetchRealEstateHistory } from "@/lib/market-data/real-estate";
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

  try {
    // Check cache first
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

    // Fetch fresh data
    let dataPoints = [];
    if (assetType === "crypto") {
      dataPoints = await fetchCryptoHistory(symbol, range);
    } else if (assetType === "stock") {
      dataPoints = await fetchStockHistory(symbol, range);
    } else {
      dataPoints = await fetchRealEstateHistory(symbol, range);
    }

    // Upsert to cache
    const now = new Date().toISOString();
    if (dataPoints.length > 0) {
      await upsertAssetData(symbol, range, assetType, dataPoints, "live");
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

    // Fall back to seed data from DB even if stale
    const stale = await getCachedAssetData(symbol, range, assetType).catch(() => null);
    if (stale) {
      return NextResponse.json({
        symbol,
        name: assetDef.name,
        type: assetType,
        range,
        data: stale.data,
        cachedAt: stale.cachedAt,
        fromCache: true,
        stale: true,
      });
    }

    return NextResponse.json({ error: "Failed to fetch asset data" }, { status: 500 });
  }
}
