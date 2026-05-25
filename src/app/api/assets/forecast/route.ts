import { NextRequest, NextResponse } from "next/server";
import { ASSET_FORECAST_SYSTEM_PROMPT } from "@/lib/claude/prompts/asset-forecast";
import { generateJSON } from "@/lib/claude/client";
import type { ForecastResponse } from "@/types/assets";
import type { DataPoint } from "@/types/database";
import { z } from "zod";

const bodySchema = z.object({
  assets: z.array(z.object({
    symbol: z.string(),
    name: z.string(),
    type: z.enum(["stock", "crypto", "real_estate"]),
    data: z.array(z.object({ date: z.string(), value: z.number(), pct_change: z.number() })),
  })),
  jurisdiction: z.enum(["usa", "uk", "saudi", "pakistan"]).optional(),
  range: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assets, jurisdiction, range } = bodySchema.parse(body);

    const today = new Date().toISOString().split("T")[0];

    // Build a concise context for Claude (last 24 data points per asset to keep tokens manageable)
    const assetSummaries = assets.map((asset) => {
      const recent = asset.data.slice(-24);
      const latest = recent.at(-1);
      const oldest = recent.at(0);
      const ytdStart = recent.find((d: DataPoint) => d.date.startsWith(new Date().getFullYear().toString()));
      return {
        symbol: asset.symbol,
        name: asset.name,
        asset_type: asset.type,
        current_value: latest?.value ?? 0,
        ytd_pct_change: ytdStart && latest
          ? Math.round(((latest.value - ytdStart.value) / ytdStart.value) * 10000) / 100
          : 0,
        range_pct_change: oldest && latest
          ? Math.round(((latest.value - oldest.value) / oldest.value) * 10000) / 100
          : 0,
        data_range: { from: oldest?.date, to: latest?.date },
        recent_monthly_values: recent.slice(-6).map((d: DataPoint) => ({ date: d.date, value: d.value })),
      };
    });

    const userPrompt = `Generate a financial forecast for the following assets as of ${today}:

${JSON.stringify(assetSummaries, null, 2)}

User jurisdiction: ${jurisdiction ?? "global"}
Analysis period requested: ${range ?? "5y"}

Return the forecast in the exact JSON schema specified in your system prompt.`;

    const forecast = await generateJSON<ForecastResponse>(userPrompt, ASSET_FORECAST_SYSTEM_PROMPT);

    return NextResponse.json({ forecast });
  } catch (err) {
    console.error("[assets/forecast] error:", err);
    return NextResponse.json({ error: "Failed to generate forecast" }, { status: 500 });
  }
}
