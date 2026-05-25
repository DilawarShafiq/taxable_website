import { STAFF_ASSISTANT_SYSTEM_PROMPT } from "@/lib/claude/prompts/staff-assistant";
import { claude, CLAUDE_MODEL } from "@/lib/claude/client";
import { getSession } from "@/lib/auth/session";
import { queryOne } from "@/lib/db/pool";
import { z } from "zod";

const bodySchema = z.object({
  prompt: z.string().min(1),
  caseId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (!["staff", "admin", "ceo"].includes(session.role)) return Response.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { prompt, caseId, clientId } = bodySchema.parse(body);

    // Build context from Supabase if case/client context provided
    let contextBlock = "";
    if (caseId) {
      const caseData = await queryOne<{ title: string; type: string; jurisdiction: string; status: string; notes: string | null; tax_year: string | null }>(
        "SELECT title, type, jurisdiction, status, notes, tax_year FROM cases WHERE id = $1", [caseId]
      );
      if (caseData) {
        contextBlock += `\n\n## Case Context\n- Title: ${caseData.title}\n- Type: ${caseData.type}\n- Jurisdiction: ${caseData.jurisdiction}\n- Status: ${caseData.status}\n- Tax Year: ${caseData.tax_year ?? "N/A"}\n- Notes: ${caseData.notes ?? "None"}`;
      }
    }
    if (clientId) {
      const clientData = await queryOne<{ company_name: string | null; business_type: string | null; jurisdictions: string[] }>(
        "SELECT company_name, business_type, jurisdictions FROM clients WHERE id = $1", [clientId]
      );
      if (clientData) {
        contextBlock += `\n\n## Client Context\n- Company: ${clientData.company_name ?? "Individual"}\n- Business Type: ${clientData.business_type ?? "Unknown"}\n- Jurisdictions: ${clientData.jurisdictions.join(", ")}`;
      }
    }

    const systemPrompt = STAFF_ASSISTANT_SYSTEM_PROMPT + contextBlock;

    const stream = await claude.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
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
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (err) {
    console.error("[ai/assist] error:", err);
    return Response.json({ error: "Failed to process AI request" }, { status: 500 });
  }
}
