import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { query } from "@/lib/db/pool";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  pending: { color: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-3 w-3" /> },
  processing: { color: "bg-blue-100 text-blue-700", icon: <Clock className="h-3 w-3 animate-spin" /> },
  processed: { color: "bg-green-100 text-green-700", icon: <CheckCircle className="h-3 w-3" /> },
  failed: { color: "bg-red-100 text-red-600", icon: <AlertCircle className="h-3 w-3" /> },
};

export default async function AdminDocumentsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  let documents: { id: string; file_name: string; mime_type: string | null; processing_status: string; created_at: string; client_name: string }[] = [];
  try {
    documents = await query(
      `SELECT d.id, d.file_name, d.mime_type, d.processing_status, d.created_at,
       COALESCE(p.full_name, cl.company_name, 'Unknown') AS client_name
       FROM documents d
       JOIN clients cl ON cl.id = d.client_id
       JOIN profiles p ON p.id = cl.profile_id
       ORDER BY d.created_at DESC LIMIT 100`
    );
  } catch { /* no docs yet */ }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500 text-sm mt-1">All client-uploaded documents</p>
      </div>

      {documents.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">File</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => {
                const cfg = STATUS_CONFIG[doc.processing_status] ?? STATUS_CONFIG.pending;
                return (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 truncate max-w-[200px]">{doc.file_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{doc.client_name}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{doc.mime_type ?? "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cfg.color}`}>
                        {cfg.icon}
                        {doc.processing_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {new Date(doc.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
