/**
 * Agentic real estate data collector.
 *
 * Claude acts as the agent: it receives a list of authoritative source URLs,
 * calls the fetch_page tool to retrieve their content, then extracts and
 * returns structured price-index data as JSON.
 *
 * Sources:
 *  Pakistan  → SBP House Price Index (sbp.org.pk) + Zameen trends
 *  Saudi     → GASTAT Real Estate Price Index (stats.gov.sa)
 */

import Anthropic from "@anthropic-ai/sdk";
import { PARAMS } from "@/lib/claude/client";
import type { DataPoint } from "@/types/database";

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? "" });

// ─── Tool definition ──────────────────────────────────────────────────────────

const FETCH_TOOL: Anthropic.Tool = {
  name: "fetch_page",
  description:
    "Fetch the text content of a web page. Returns up to 12,000 characters of visible text (tags stripped). Use this to read real estate price index tables, statistics pages, and reports.",
  input_schema: {
    type: "object" as const,
    properties: {
      url: { type: "string", description: "Full URL to fetch" },
    },
    required: ["url"],
  },
};

// ─── Source definitions ───────────────────────────────────────────────────────

const SOURCES: Record<string, { urls: string[]; instructions: string }> = {
  RE_PK: {
    urls: [
      "https://www.sbp.org.pk/ecodata/index2.asp",
      "https://www.numbeo.com/property-investment/country_result.jsp?country=Pakistan",
      "https://www.zameen.com/trends/",
      "https://www.sbp.org.pk/publications/quarterlybsr/bsr.asp",
    ],
    instructions: `Extract Pakistan House Price Index (HPI) quarterly data from the SBP or any of the provided pages.
Return an array of data points covering as many years as possible (ideally 2015–present).
Each point must have: date (YYYY-MM-DD, first of month), value (index or PKR per sqft — normalise to an index with 2015 = 100 if raw values are given).`,
  },
  RE_SA: {
    urls: [
      "https://www.stats.gov.sa/en/832",
      "https://www.stats.gov.sa/en/indicators/real-estate-price-index",
      "https://www.numbeo.com/property-investment/country_result.jsp?country=Saudi+Arabia",
      "https://www.cbre.com/insights/figures/saudi-arabia-real-estate-market-review",
    ],
    instructions: `Extract Saudi Arabia Real Estate Price Index quarterly or annual data from GASTAT or any provided page.
Return an array of data points covering as many years as possible (ideally 2015–present).
Each point must have: date (YYYY-MM-DD, first of month), value (official index, or SAR/sqm normalised to index with 2015 = 100).`,
  },
  RE_AE: {
    urls: [
      "https://www.reidin.com/en/uae/market-data",
      "https://www.numbeo.com/property-investment/country_result.jsp?country=United+Arab+Emirates",
      "https://www.propertyfinder.ae/blog/dubai-property-market-report/",
      "https://dubailand.gov.ae/en/open-data/real-estate-statistics/",
    ],
    instructions: `Extract UAE / Dubai real estate price index or AED-per-sqft data quarterly or annual from any provided page.
Return an array of data points covering as many years as possible (ideally 2015–present).
Each point must have: date (YYYY-MM-DD, first of month), value (AED per sqft or index normalised to base 100 = January 2015).`,
  },
};

// ─── Tool executor ────────────────────────────────────────────────────────────

async function executeFetchPage(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TaxableAI/1.0; +https://taxable.ai)",
        "Accept": "text/html,application/xhtml+xml,text/plain",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return `[HTTP ${res.status} for ${url}]`;

    const html = await res.text();
    // Strip tags and collapse whitespace
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 12000);

    return text || "[empty page]";
  } catch (err) {
    return `[fetch error: ${err instanceof Error ? err.message : String(err)}]`;
  }
}

// ─── Agent loop ───────────────────────────────────────────────────────────────

export interface ScrapedDataPoint {
  date: string;
  value: number;
}

const COUNTRY_NAMES: Record<string, string> = {
  RE_PK: "Pakistan",
  RE_SA: "Saudi Arabia",
  RE_AE: "UAE (Dubai)",
};

export async function agenticFetchRealEstateData(
  symbol: "RE_PK" | "RE_SA" | "RE_AE"
): Promise<DataPoint[]> {
  const source = SOURCES[symbol];
  if (!source) throw new Error(`Unknown symbol: ${symbol}`);

  const systemPrompt = `You are a financial data extraction agent for Taxable AI.
Your job is to retrieve real estate price index data for ${COUNTRY_NAMES[symbol] ?? symbol}.

Use the fetch_page tool to browse the provided URLs and find historical price index data.
Once you have gathered enough data, return ONLY a JSON array (no markdown fences) in this exact format:
[
  { "date": "2015-01-01", "value": 100 },
  { "date": "2016-01-01", "value": 112 },
  ...
]

Rules:
- Dates must be YYYY-MM-DD (first of the month or quarter)
- Values must be a consistent numeric index (normalise to base 100 = January 2015 if raw prices are used)
- Include as many data points as you can find (target: every quarter 2015–present)
- If a page returns an error or is unhelpful, try the next URL
- When you have sufficient data, stop fetching and return the JSON array`;

  const userMessage = `${source.instructions}

Available URLs to fetch:
${source.urls.map((u, i) => `${i + 1}. ${u}`).join("\n")}

Fetch the most promising URLs first, extract the price data, and return the JSON array.`;

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  // Agentic loop — max 8 tool calls to prevent runaway
  for (let iteration = 0; iteration < 8; iteration++) {
    const response = await claude.messages.create({
      model: "claude-sonnet-4-6",
      ...PARAMS.DATA_EXTRACTION,
      system: systemPrompt,
      tools: [FETCH_TOOL],
      messages,
    });

    // Collect text and tool_use blocks
    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );
    const textBlocks = response.content.filter(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );

    // If Claude returned a final text answer, parse it
    if (response.stop_reason === "end_turn" || toolUseBlocks.length === 0) {
      const finalText = textBlocks.map((b) => b.text).join("");
      try {
        const raw: ScrapedDataPoint[] = JSON.parse(finalText.trim());
        return normaliseToDataPoints(raw);
      } catch {
        // Try to extract JSON array from text
        const match = finalText.match(/\[[\s\S]*\]/);
        if (match) {
          const raw: ScrapedDataPoint[] = JSON.parse(match[0]);
          return normaliseToDataPoints(raw);
        }
        throw new Error(`[agentic-scraper] Could not parse final response for ${symbol}`);
      }
    }

    // Execute tool calls
    const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
      toolUseBlocks.map(async (block) => {
        const input = block.input as { url: string };
        const content = await executeFetchPage(input.url);
        return {
          type: "tool_result" as const,
          tool_use_id: block.id,
          content,
        };
      })
    );

    // Append assistant response + tool results to message history
    messages.push({ role: "assistant", content: response.content });
    messages.push({ role: "user", content: toolResults });
  }

  throw new Error(`[agentic-scraper] Exceeded iteration limit for ${symbol}`);
}

function normaliseToDataPoints(raw: ScrapedDataPoint[]): DataPoint[] {
  if (!raw.length) return [];
  // Sort chronologically
  const sorted = [...raw].sort((a, b) => a.date.localeCompare(b.date));
  const startValue = sorted[0].value;
  return sorted.map((p) => ({
    date: p.date,
    value: Math.round(p.value * 100) / 100,
    pct_change:
      startValue > 0
        ? Math.round(((p.value - startValue) / startValue) * 10000) / 100
        : 0,
  }));
}
