import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { query, queryOne } from "@/lib/db/pool";
import { MessageSquare } from "lucide-react";

export default async function ClientMessagesPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  let messages: { id: string; content: string; sender_id: string; sender_name: string; created_at: string; is_mine: boolean }[] = [];
  try {
    const clientRow = await queryOne<{ id: string }>("SELECT id FROM clients WHERE profile_id = $1", [session.uid]);
    if (clientRow) {
      const rows = await query<{ id: string; content: string; sender_id: string; sender_name: string; created_at: string }>(
        `SELECT m.id, m.content, m.sender_id,
         COALESCE(p.full_name, 'Team Member') AS sender_name,
         m.created_at
         FROM messages m
         JOIN cases c ON c.id = m.case_id
         LEFT JOIN profiles p ON p.id = m.sender_id
         WHERE c.client_id = $1
         ORDER BY m.created_at ASC
         LIMIT 100`,
        [clientRow.id]
      );
      messages = rows.map((r) => ({ ...r, is_mine: r.sender_id === session.uid }));
    }
  } catch { /* messages or cases table may not have data yet */ }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">Communicate with your accountant through your cases</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col" style={{ minHeight: 480 }}>
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <MessageSquare className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">No messages yet</p>
              <p className="text-xs text-gray-400 mt-1">Messages from your accountant will appear here once a case is created</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.is_mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-xl px-4 py-3 ${msg.is_mine ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                  {!msg.is_mine && (
                    <p className="text-[11px] font-semibold text-gray-500 mb-1">{msg.sender_name}</p>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.is_mine ? "text-blue-200" : "text-gray-400"}`}>
                    {new Date(msg.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Messaging will be available once your case is active…"
              disabled
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
