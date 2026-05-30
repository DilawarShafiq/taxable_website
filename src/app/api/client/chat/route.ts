import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { queryOne } from "@/lib/db/pool";
import { claude, CLAUDE_MODEL, PARAMS } from "@/lib/claude/client";
import { buildSystemPrompt } from "@/lib/agents/orchestrator";
import type { AgentType } from "@/lib/agents/types";
import { z } from "zod";

const bodySchema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  jurisdictions: z.array(z.string()).optional(),
  thinking: z.boolean().optional(),
  agentType: z.enum(["tax_advisor", "document_analyzer", "compliance_monitor", "market_analyst", "general"]).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorised" }), { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), { status: 503 });
  }

  try {
    const body = await req.json();
    const { messages, jurisdictions: bodyJurisdictions, thinking: useThinking, agentType } = bodySchema.parse(body);

    // Load full client profile from DB for personalization
    let clientJurisdictions = bodyJurisdictions ?? [];
    let clientName = session.user.name ?? "";
    let businessType = "";
    let companyName = "";
    try {
      const clientRow = await queryOne<{
        jurisdictions: string[];
        business_type: string | null;
        company_name: string | null;
        full_name: string | null;
      }>(
        `SELECT c.jurisdictions, c.business_type, c.company_name, p.full_name
         FROM clients c JOIN profiles p ON p.id = c.profile_id
         WHERE c.profile_id = $1`,
        [session.user.id]
      );
      if (clientRow) {
        if (!clientJurisdictions.length) clientJurisdictions = clientRow.jurisdictions ?? [];
        businessType = clientRow.business_type ?? "";
        companyName = clientRow.company_name ?? "";
        clientName = clientRow.full_name ?? clientName;
      }
    } catch { /* use session fallback */ }

    // Route to the best agent based on message content + context
    const latestMessage = messages.at(-1)?.content ?? "";
    const { systemPrompt, agentType: resolvedAgent } = buildSystemPrompt(latestMessage, {
      jurisdictions: clientJurisdictions,
      businessType,
      companyName,
      clientName,
      agentType: (agentType as AgentType) ?? "general",
    });

    const encoder = new TextEncoder();

    // Send agent type in first SSE event so the UI knows which specialist is responding
    const agentHeader = encoder.encode(
      `data: ${JSON.stringify({ type: "agent", agent: resolvedAgent })}\n\n`
    );

    if (useThinking) {
      const stream = await claude.messages.stream({
        model: CLAUDE_MODEL,
        ...PARAMS.EXTENDED_THINKING,
        thinking: { type: "enabled", budget_tokens: 10000 },
        system: systemPrompt,
        messages,
      } as Parameters<typeof claude.messages.stream>[0]);

      const readable = new ReadableStream({
        async start(controller) {
          controller.enqueue(agentHeader);
          for await (const chunk of stream) {
            if (chunk.type === "content_block_start") {
              if (chunk.content_block.type === "thinking") {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "thinking_start" })}\n\n`));
              } else if (chunk.content_block.type === "text") {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text_start" })}\n\n`));
              }
            } else if (chunk.type === "content_block_delta") {
              if (chunk.delta.type === "thinking_delta") {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "thinking", text: chunk.delta.thinking })}\n\n`));
              } else if (chunk.delta.type === "text_delta") {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text: chunk.delta.text })}\n\n`));
              }
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
      });
    } else {
      const stream = await claude.messages.stream({
        model: CLAUDE_MODEL,
        ...PARAMS.TAX_ADVICE,
        system: systemPrompt,
        messages,
      });

      const readable = new ReadableStream({
        async start(controller) {
          controller.enqueue(agentHeader);
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text: chunk.delta.text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
      });
    }
  } catch (err) {
    console.error("[client/chat]", err);
    return new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
  }
}
