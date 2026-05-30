import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { queryOne, query } from "@/lib/db/pool";

// GET /api/client/chat-sessions — list sessions for current user
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const uid = session.user.uid ?? session.user.id;

  try {
    if (sessionId) {
      // Load full messages for a specific session
      const messages = await query<{
        id: string;
        role: string;
        content: string;
        thinking: string | null;
        agent_type: string | null;
        files: string[] | null;
        created_at: string;
      }>(
        `SELECT m.id, m.role, m.content, m.thinking, m.agent_type, m.files, m.created_at
         FROM ai_chat_messages m
         JOIN ai_chat_sessions s ON s.id = m.session_id
         WHERE m.session_id = $1 AND s.profile_id = $2
         ORDER BY m.created_at ASC`,
        [sessionId, uid]
      );
      return NextResponse.json({ messages });
    }

    // List recent sessions
    const sessions = await query<{
      id: string;
      title: string | null;
      agent_type: string;
      message_count: number;
      updated_at: string;
    }>(
      `SELECT id, title, agent_type, message_count, updated_at
       FROM ai_chat_sessions
       WHERE profile_id = $1
       ORDER BY updated_at DESC
       LIMIT 20`,
      [uid]
    );
    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("[chat-sessions GET]", err);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

// POST /api/client/chat-sessions — create session or append messages
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const uid = session.user.uid ?? session.user.id;

  try {
    const body = await req.json() as {
      action: "create" | "append" | "delete";
      sessionId?: string;
      agentType?: string;
      jurisdictions?: string[];
      messages?: Array<{
        role: string;
        content: string;
        thinking?: string;
        agent?: string;
        files?: string[];
      }>;
    };

    if (body.action === "create") {
      const row = await queryOne<{ id: string }>(
        `INSERT INTO ai_chat_sessions (profile_id, agent_type, jurisdictions)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [uid, body.agentType ?? "general", body.jurisdictions ?? []]
      );
      return NextResponse.json({ sessionId: row?.id });
    }

    if (body.action === "append" && body.sessionId && body.messages?.length) {
      // Verify session belongs to user
      const sessionRow = await queryOne<{ id: string }>(
        `SELECT id FROM ai_chat_sessions WHERE id = $1 AND profile_id = $2`,
        [body.sessionId, uid]
      );
      if (!sessionRow) return NextResponse.json({ error: "Session not found" }, { status: 404 });

      // Insert messages in order
      for (const msg of body.messages) {
        await queryOne(
          `INSERT INTO ai_chat_messages (session_id, role, content, thinking, agent_type, files)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [body.sessionId, msg.role, msg.content, msg.thinking ?? null, msg.agent ?? null, msg.files ?? null]
        );
      }
      return NextResponse.json({ ok: true });
    }

    if (body.action === "delete" && body.sessionId) {
      await queryOne(
        `DELETE FROM ai_chat_sessions WHERE id = $1 AND profile_id = $2`,
        [body.sessionId, uid]
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[chat-sessions POST]", err);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
