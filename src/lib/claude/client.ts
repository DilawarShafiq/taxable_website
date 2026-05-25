import Anthropic from "@anthropic-ai/sdk";

// Uses Google Cloud Vertex AI for Claude.
// Auth comes from Application Default Credentials (ADC) in Cloud Run,
// or GOOGLE_APPLICATION_CREDENTIALS in local dev.
export const claude = new Anthropic({
  // Vertex AI endpoint is handled by the SDK when these env vars are set
  apiKey: "vertex", // placeholder — SDK uses Vertex when project is set
  defaultHeaders: {
    "anthropic-vertex-project": process.env.ANTHROPIC_VERTEX_PROJECT_ID ?? "",
  },
});

export const CLAUDE_MODEL = "claude-opus-4-7@20260501";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function streamChat(
  messages: ChatMessage[],
  systemPrompt: string,
  onChunk: (text: string) => void
): Promise<void> {
  const stream = await claude.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      onChunk(chunk.delta.text);
    }
  }
}

export async function generateJSON<T>(
  prompt: string,
  systemPrompt: string
): Promise<T> {
  const response = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ?? [null, text];
  return JSON.parse(jsonMatch[1] ?? text) as T;
}
