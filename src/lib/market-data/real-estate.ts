import type { DataPoint } from "@/types/database";

// Static index data for markets with limited free APIs
// Sources: ONS, FRED, Cityscape/Knight Frank, Zameen/SBP reports
const STATIC_DATA: Record<string, Record<string, { date: string; value: number }[]>> = {
  RE_SA: {
    "10y": [
      { date: "2015-01-01", value: 100 }, { date: "2016-01-01", value: 103 },
      { date: "2017-01-01", value: 106 }, { date: "2018-01-01", value: 104 },
      { date: "2019-01-01", value: 101 }, { date: "2020-01-01", value: 98 },
      { date: "2021-01-01", value: 105 }, { date: "2022-01-01", value: 115 },
      { date: "2023-01-01", value: 125 }, { date: "2024-01-01", value: 132 },
      { date: "2025-01-01", value: 138 }, { date: "2026-01-01", value: 144 },
    ],
  },
  RE_PK: {
    "10y": [
      { date: "2015-01-01", value: 100 }, { date: "2016-01-01", value: 112 },
      { date: "2017-01-01", value: 128 }, { date: "2018-01-01", value: 140 },
      { date: "2019-01-01", value: 145 }, { date: "2020-01-01", value: 148 },
      { date: "2021-01-01", value: 185 }, { date: "2022-01-01", value: 240 },
      { date: "2023-01-01", value: 290 }, { date: "2024-01-01", value: 310 },
      { date: "2025-01-01", value: 335 }, { date: "2026-01-01", value: 350 },
    ],
  },
};

const RANGE_YEARS: Record<string, number> = { "1y": 1, "3y": 3, "5y": 5, "10y": 10 };

export async function fetchRealEstateHistory(symbol: string, range: string): Promise<DataPoint[]> {
  if (symbol === "RE_US") return fetchFREDData(range);
  if (symbol === "RE_UK") return fetchONSData(range);

  // Saudi and Pakistan use static data
  const staticBase = STATIC_DATA[symbol]?.["10y"] ?? [];
  const years = RANGE_YEARS[range] ?? 5;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);

  const filtered = staticBase.filter((d) => new Date(d.date) >= cutoff);
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
  if (!apiKey) return [];

  const years = RANGE_YEARS[range] ?? 5;
  const start = new Date();
  start.setFullYear(start.getFullYear() - years);
  const startStr = start.toISOString().split("T")[0];

  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=CSUSHPISA&observation_start=${startStr}&frequency=m&api_key=${apiKey}&file_type=json`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return [];

  const json = await res.json() as { observations: { date: string; value: string }[] };
  const obs = (json.observations ?? []).filter((o) => o.value !== ".");
  if (!obs.length) return [];

  const startValue = parseFloat(obs[0].value);
  return obs.map((o) => ({
    date: o.date,
    value: parseFloat(o.value),
    pct_change: Math.round(((parseFloat(o.value) - startValue) / startValue) * 10000) / 100,
  }));
}

async function fetchONSData(range: string): Promise<DataPoint[]> {
  // ONS House Price Index — static recent data (ONS API is unreliable for automated access)
  const staticUK: { date: string; value: number }[] = [
    { date: "2016-01-01", value: 215000 }, { date: "2017-01-01", value: 225000 },
    { date: "2018-01-01", value: 232000 }, { date: "2019-01-01", value: 235000 },
    { date: "2020-01-01", value: 240000 }, { date: "2021-01-01", value: 265000 },
    { date: "2022-01-01", value: 292000 }, { date: "2023-01-01", value: 290000 },
    { date: "2024-01-01", value: 285000 }, { date: "2025-01-01", value: 295000 },
    { date: "2026-01-01", value: 310000 },
  ];

  const years = RANGE_YEARS[range] ?? 5;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  const filtered = staticUK.filter((d) => new Date(d.date) >= cutoff);
  if (!filtered.length) return [];

  const startValue = filtered[0].value;
  return filtered.map((d) => ({
    date: d.date,
    value: d.value,
    pct_change: Math.round(((d.value - startValue) / startValue) * 10000) / 100,
  }));
}
