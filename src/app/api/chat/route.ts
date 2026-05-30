import { CHATBOT_SYSTEM_PROMPT } from "@/lib/claude/prompts/chatbot";
import { claude } from "@/lib/claude/client";
import { query } from "@/lib/db/pool";
import { z } from "zod";

const HAIKU_MODEL = "claude-haiku-4-5-20251001";

const bodySchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
  jurisdiction: z.enum(["usa", "uk", "saudi", "pakistan", "uae"]).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, jurisdiction } = bodySchema.parse(body);

    const systemPrompt = jurisdiction
      ? `${CHATBOT_SYSTEM_PROMPT}\n\n## Current Context\nThe visitor is asking about ${jurisdiction.toUpperCase()} services. Prioritise ${jurisdiction.toUpperCase()}-specific information.`
      : CHATBOT_SYSTEM_PROMPT;

    const stream = await claude.messages.stream({
      model: HAIKU_MODEL,
      temperature: 0.3,
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    });

    // Persist lead if user shared an email
    const lastUserMsg = messages.filter((m) => m.role === "user").at(-1)?.content ?? "";
    const emailMatch = lastUserMsg.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      query(
        "INSERT INTO leads (name, email, source, message, jurisdiction) VALUES ($1,$2,$3,$4,$5)",
        ["Chatbot Lead", emailMatch[0], "chatbot", lastUserMsg, jurisdiction ?? null]
      ).catch(() => {});
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[chat] error:", err);
    return Response.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
