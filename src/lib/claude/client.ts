import Anthropic from "@anthropic-ai/sdk";

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

export const CLAUDE_MODEL = "claude-sonnet-4-6";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/**
 * Parameter strategy for a professional tax/accounting domain:
 *
 * Tax advice & compliance:
 *   temperature: 0.1  — high precision, consistent answers, no hallucinated rates
 *   max_tokens: 8192  — full detailed responses with tables and calculations
 *
 * Document analysis:
 *   temperature: 0.0  — deterministic extraction; same doc = same output every time
 *   max_tokens: 4096  — structured output
 *
 * AI forecasts & narrative:
 *   temperature: 0.3  — some creativity for narrative, but grounded in data
 *   max_tokens: 4096
 *
 * Extended thinking (deep analysis):
 *   temperature: 1.0  — REQUIRED by Anthropic when extended thinking is enabled
 *   budget_tokens: 10000 — reasoning budget before response
 *
 * Top-p / top-k: Claude does not expose these parameters in the API.
 * Temperature is the only sampling parameter available.
 */

export const PARAMS = {
  TAX_ADVICE: {
    temperature: 0.1 as const,
    max_tokens: 8192 as const,
  },
  DOCUMENT_ANALYSIS: {
    temperature: 0.0 as const,
    max_tokens: 4096 as const,
  },
  FORECAST_NARRATIVE: {
    temperature: 0.3 as const,
    max_tokens: 4096 as const,
  },
  EXTENDED_THINKING: {
    temperature: 1 as const,      // Required by Anthropic when using extended thinking
    max_tokens: 16000 as const,
  },
  DATA_EXTRACTION: {
    temperature: 0.0 as const,    // Agentic scraper — deterministic JSON output
    max_tokens: 4096 as const,
  },
} as const;

export async function streamChat(
  messages: ChatMessage[],
  systemPrompt: string,
  onChunk: (text: string) => void
): Promise<void> {
  const stream = await claude.messages.stream({
    model: CLAUDE_MODEL,
    ...PARAMS.TAX_ADVICE,
    system: systemPrompt,
    messages,
  });

  for await (const chunk of stream) {
    if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
      onChunk(chunk.delta.text);
    }
  }
}

export async function generateJSON<T>(prompt: string, systemPrompt: string): Promise<T> {
  const response = await claude.messages.create({
    model: CLAUDE_MODEL,
    ...PARAMS.DOCUMENT_ANALYSIS,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });
  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ?? [null, text];
  return JSON.parse(jsonMatch[1] ?? text) as T;
}
