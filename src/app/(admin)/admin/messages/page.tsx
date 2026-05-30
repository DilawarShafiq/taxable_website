import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db/pool";
import { MessageSquare, Users } from "lucide-react";

export default async function AdminMessagesPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  let threads: { client_id: string; client_name: string; last_message: string; last_at: string; unread: string }[] = [];
  try {
    threads = await query(
      `SELECT cl.id AS client_id,
       COALESCE(p.full_name, cl.company_name, 'Unknown') AS client_name,
       (SELECT m.content FROM messages m
        JOIN cases c ON c.id = m.case_id
        WHERE c.client_id = cl.id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
       (SELECT m.created_at FROM messages m
        JOIN cases c ON c.id = m.case_id
        WHERE c.client_id = cl.id ORDER BY m.created_at DESC LIMIT 1) AS last_at,
       (SELECT COUNT(*)::text FROM messages m
        JOIN cases c ON c.id = m.case_id
        WHERE c.client_id = cl.id AND m.read_at IS NULL) AS unread
       FROM clients cl
       JOIN profiles p ON p.id = cl.profile_id
       WHERE EXISTS (
         SELECT 1 FROM messages m
         JOIN cases c ON c.id = m.case_id
         WHERE c.client_id = cl.id
       )
       ORDER BY last_at DESC NULLS LAST
       LIMIT 30`
    );
  } catch { /* no messages yet */ }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">Client message threads</p>
      </div>

      {threads.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No messages yet</p>
          <p className="text-xs text-gray-400 mt-1">Client conversations will appear here</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {threads.map((t) => (
            <div key={t.client_id} className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-sm flex-shrink-0">
                {t.client_name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{t.client_name}</p>
                  {t.last_at && (
                    <p className="text-[11px] text-gray-400">
                      {new Date(t.last_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{t.last_message ?? "No messages"}</p>
              </div>
              {parseInt(t.unread) > 0 && (
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {t.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
