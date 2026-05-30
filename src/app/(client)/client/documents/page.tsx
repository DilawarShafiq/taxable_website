import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { query, queryOne } from "@/lib/db/pool";
import { FileText, Upload, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { DOCUMENT_STATUS_COLORS } from "@/lib/constants";
const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  processing: <Clock className="h-3.5 w-3.5" />,
  done: <CheckCircle className="h-3.5 w-3.5" />,
  failed: <AlertCircle className="h-3.5 w-3.5" />,
};

export default async function ClientDocumentsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  let documents: { id: string; file_name: string; mime_type: string | null; processing_status: string; created_at: string }[] = [];
  try {
    const clientRow = await queryOne<{ id: string }>("SELECT id FROM clients WHERE profile_id = $1", [session.uid]);
    if (clientRow) {
      documents = await query(
        "SELECT id, file_name, mime_type, processing_status, created_at FROM documents WHERE client_id = $1 ORDER BY created_at DESC LIMIT 50",
        [clientRow.id]
      );
    }
  } catch { /* no documents yet */ }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 text-sm mt-1">Your uploaded financial documents</p>
        </div>
        <Link
          href="/client/upload"
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 mb-1">No documents yet</p>
          <p className="text-xs text-gray-400 mb-4">Upload your bank statements, invoices, or tax documents</p>
          <Link
            href="/client/upload"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Upload className="h-4 w-4" />
            Upload Your First Document
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">File</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-900 truncate max-w-[240px]">{doc.file_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{doc.mime_type ?? "—"}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${DOCUMENT_STATUS_COLORS[doc.processing_status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_ICONS[doc.processing_status]}
                      {doc.processing_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {new Date(doc.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
