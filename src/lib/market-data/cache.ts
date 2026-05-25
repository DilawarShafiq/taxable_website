import { query, queryOne } from "@/lib/db/pool";
import type { DataPoint } from "@/types/database";

const CACHE_TTL_MS: Record<string, number> = {
  crypto: 15 * 60 * 1000,        // 15 min
  stock: 60 * 60 * 1000,          // 1 hour
  real_estate: 24 * 60 * 60 * 1000, // 24 hours
};

export async function getCachedAssetData(
  symbol: string,
  range: string,
  assetType: string
): Promise<{ data: DataPoint[]; cachedAt: string } | null> {
  const data = await queryOne<{ data_points: unknown; last_updated: string }>(
    "SELECT data_points, last_updated FROM asset_cache WHERE symbol = $1 AND time_range = $2",
    [symbol, range]
  );

  if (!data) return null;

  const age = Date.now() - new Date(data.last_updated).getTime();
  const ttl = CACHE_TTL_MS[assetType] ?? CACHE_TTL_MS.stock;
  if (age > ttl) return null;

  return { data: data.data_points as DataPoint[], cachedAt: data.last_updated };
}

export async function upsertAssetData(
  symbol: string,
  range: string,
  assetType: string,
  dataPoints: DataPoint[],
  source: string
): Promise<void> {
  await query(
    `INSERT INTO asset_cache (symbol, time_range, asset_type, data_points, source, last_updated)
     VALUES ($1,$2,$3,$4,$5,NOW())
     ON CONFLICT (symbol, time_range) DO UPDATE
     SET data_points=$4, source=$5, last_updated=NOW()`,
    [symbol, range, assetType, JSON.stringify(dataPoints), source]
  );
}
