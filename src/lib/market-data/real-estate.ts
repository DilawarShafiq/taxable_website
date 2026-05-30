import type { DataPoint } from "@/types/database";
import { agenticFetchRealEstateData } from "./agentic-scraper";

// UK ONS HPI — quarterly, updated from ONS UK HPI dataset (average UK house prices, GBP)
const UK_HPI: { date: string; value: number }[] = [
  { date: "2015-01-01", value: 192000 }, { date: "2015-04-01", value: 196000 },
  { date: "2015-07-01", value: 200000 }, { date: "2015-10-01", value: 203000 },
  { date: "2016-01-01", value: 207000 }, { date: "2016-04-01", value: 215000 },
  { date: "2016-07-01", value: 217000 }, { date: "2016-10-01", value: 220000 },
  { date: "2017-01-01", value: 223000 }, { date: "2017-04-01", value: 225000 },
  { date: "2017-07-01", value: 228000 }, { date: "2017-10-01", value: 229000 },
  { date: "2018-01-01", value: 232000 }, { date: "2018-04-01", value: 234000 },
  { date: "2018-07-01", value: 236000 }, { date: "2018-10-01", value: 234000 },
  { date: "2019-01-01", value: 233000 }, { date: "2019-04-01", value: 235000 },
  { date: "2019-07-01", value: 237000 }, { date: "2019-10-01", value: 238000 },
  { date: "2020-01-01", value: 238000 }, { date: "2020-04-01", value: 233000 },
  { date: "2020-07-01", value: 241000 }, { date: "2020-10-01", value: 252000 },
  { date: "2021-01-01", value: 258000 }, { date: "2021-04-01", value: 275000 },
  { date: "2021-07-01", value: 280000 }, { date: "2021-10-01", value: 285000 },
  { date: "2022-01-01", value: 292000 }, { date: "2022-04-01", value: 302000 },
  { date: "2022-07-01", value: 296000 }, { date: "2022-10-01", value: 288000 },
  { date: "2023-01-01", value: 285000 }, { date: "2023-04-01", value: 287000 },
  { date: "2023-07-01", value: 290000 }, { date: "2023-10-01", value: 285000 },
  { date: "2024-01-01", value: 283000 }, { date: "2024-04-01", value: 288000 },
  { date: "2024-07-01", value: 293000 }, { date: "2024-10-01", value: 298000 },
  { date: "2025-01-01", value: 303000 }, { date: "2025-04-01", value: 308000 },
];

// US CSUSHPISA approximate values used as fallback when FRED API is unavailable
const US_HPI: { date: string; value: number }[] = [
  { date: "2015-01-01", value: 165 }, { date: "2015-07-01", value: 171 },
  { date: "2016-01-01", value: 175 }, { date: "2016-07-01", value: 182 },
  { date: "2017-01-01", value: 187 }, { date: "2017-07-01", value: 194 },
  { date: "2018-01-01", value: 199 }, { date: "2018-07-01", value: 206 },
  { date: "2019-01-01", value: 207 }, { date: "2019-07-01", value: 213 },
  { date: "2020-01-01", value: 216 }, { date: "2020-07-01", value: 228 },
  { date: "2021-01-01", value: 242 }, { date: "2021-07-01", value: 272 },
  { date: "2022-01-01", value: 292 }, { date: "2022-07-01", value: 305 },
  { date: "2023-01-01", value: 293 }, { date: "2023-07-01", value: 308 },
  { date: "2024-01-01", value: 316 }, { date: "2024-07-01", value: 325 },
  { date: "2025-01-01", value: 331 }, { date: "2025-07-01", value: 338 },
];

// Dubai DLD Residential Price Index — AED per sqft (approximate, sourced from DLD reports)
const UAE_HPI: { date: string; value: number }[] = [
  { date: "2015-01-01", value: 1180 }, { date: "2015-07-01", value: 1120 },
  { date: "2016-01-01", value: 1080 }, { date: "2016-07-01", value: 1050 },
  { date: "2017-01-01", value: 1020 }, { date: "2017-07-01", value: 1000 },
  { date: "2018-01-01", value: 990 },  { date: "2018-07-01", value: 950 },
  { date: "2019-01-01", value: 920 },  { date: "2019-07-01", value: 900 },
  { date: "2020-01-01", value: 880 },  { date: "2020-07-01", value: 860 },
  { date: "2021-01-01", value: 900 },  { date: "2021-07-01", value: 980 },
  { date: "2022-01-01", value: 1100 }, { date: "2022-07-01", value: 1250 },
  { date: "2023-01-01", value: 1380 }, { date: "2023-07-01", value: 1450 },
  { date: "2024-01-01", value: 1520 }, { date: "2024-07-01", value: 1590 },
  { date: "2025-01-01", value: 1640 }, { date: "2025-04-01", value: 1670 },
];

const RANGE_YEARS: Record<string, number> = { "1y": 1, "3y": 3, "5y": 5, "10y": 10 };

export async function fetchRealEstateHistory(symbol: string, range: string): Promise<DataPoint[]> {
  if (symbol === "RE_US") return fetchFREDData(range);
  if (symbol === "RE_UK") return fromStaticArray(UK_HPI, range);
  // Pakistan, Saudi & UAE: try agentic scraper first, fall back to cached static
  if (symbol === "RE_PK" || symbol === "RE_SA" || symbol === "RE_AE") {
    return fetchAgenticWithFallback(symbol as "RE_PK" | "RE_SA" | "RE_AE", range);
  }
  return [];
}

async function fetchAgenticWithFallback(
  symbol: "RE_PK" | "RE_SA" | "RE_AE",
  range: string
): Promise<DataPoint[]> {
  try {
    const data = await agenticFetchRealEstateData(symbol);
    if (data.length > 0) return sliceRange(data, range);
  } catch (err) {
    console.warn(`[real-estate] Agentic fetch failed for ${symbol}, using static fallback:`, err);
  }
  // Static fallback (sourced from Knight Frank / SBP / DLD reports, base 100 = 2015)
  const FALLBACK: Record<string, { date: string; value: number }[]> = {
    RE_AE: UAE_HPI,
    RE_SA: [
      { date: "2015-01-01", value: 100 }, { date: "2016-01-01", value: 103 },
      { date: "2017-01-01", value: 106 }, { date: "2018-01-01", value: 104 },
      { date: "2019-01-01", value: 101 }, { date: "2020-01-01", value: 98 },
      { date: "2021-01-01", value: 105 }, { date: "2022-01-01", value: 115 },
      { date: "2023-01-01", value: 125 }, { date: "2024-01-01", value: 132 },
      { date: "2025-01-01", value: 138 },
    ],
    RE_PK: [
      { date: "2015-01-01", value: 100 }, { date: "2016-01-01", value: 112 },
      { date: "2017-01-01", value: 128 }, { date: "2018-01-01", value: 140 },
      { date: "2019-01-01", value: 145 }, { date: "2020-01-01", value: 148 },
      { date: "2021-01-01", value: 185 }, { date: "2022-01-01", value: 240 },
      { date: "2023-01-01", value: 290 }, { date: "2024-01-01", value: 310 },
      { date: "2025-01-01", value: 335 },
    ],
  };
  return fromStaticArray(FALLBACK[symbol] ?? [], range);
}

function sliceRange(data: DataPoint[], range: string): DataPoint[] {
  const years = RANGE_YEARS[range] ?? 5;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  const filtered = data.filter((d) => new Date(d.date) >= cutoff);
  if (!filtered.length) return data; // return all if range is too narrow
  const startValue = filtered[0].value;
  return filtered.map((d) => ({
    ...d,
    pct_change: startValue > 0 ? Math.round(((d.value - startValue) / startValue) * 10000) / 100 : 0,
  }));
}

function fromStaticArray(arr: { date: string; value: number }[], range: string): DataPoint[] {
  const years = RANGE_YEARS[range] ?? 5;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  const filtered = arr.filter((d) => new Date(d.date) >= cutoff);
  if (!filtered.length) return [];
  const startValue = filtered[0].value;
  return filtered.map((d) => ({
    date: d.date,
    value: d.value,
    pct_change: Math.round(((d.value - startValue) / startValue) * 10000) / 100,
  }));
}

async function fetchFREDData(range: string): Promise<DataPoint[]> {
  const apiKey = process.env.FRED_API_KEY;
  const years = RANGE_YEARS[range] ?? 5;
  const start = new Date();
  start.setFullYear(start.getFullYear() - years);
  const startStr = start.toISOString().split("T")[0];

  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=CSUSHPISA&observation_start=${startStr}&frequency=m&file_type=json${apiKey ? `&api_key=${apiKey}` : ""}`;

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`FRED ${res.status}`);
    const json = await res.json() as { observations: { date: string; value: string }[] };
    const obs = (json.observations ?? []).filter((o) => o.value !== ".");
    if (!obs.length) throw new Error("empty");
    const startValue = parseFloat(obs[0].value);
    return obs.map((o) => ({
      date: o.date,
      value: parseFloat(o.value),
      pct_change: Math.round(((parseFloat(o.value) - startValue) / startValue) * 10000) / 100,
    }));
  } catch {
    return fromStaticArray(US_HPI, range);
  }
}
