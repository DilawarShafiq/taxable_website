"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, FileSpreadsheet, Image, Loader2, CheckCircle, AlertCircle, X, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
}

interface ProcessingResult {
  transactions: Transaction[];
  summary: { totalCredits: number; totalDebits: number; netChange: number; transactionCount: number };
  categories: { category: string; amount: number; percentage: number }[];
  insights?: string[];
}

const ACCEPTED = ".pdf,.xlsx,.xls,.csv,.txt,.jpg,.jpeg,.png,.webp";

const FILE_TYPE_ICONS: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-5 w-5 text-red-500" />,
  excel: <FileSpreadsheet className="h-5 w-5 text-green-600" />,
  csv: <FileText className="h-5 w-5 text-blue-500" />,
  image: <Image className="h-5 w-5 text-purple-500" />,
};

export default function ClientUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { result: ProcessingResult; filename: string } | { error: string }>>({});

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      return ["pdf", "xlsx", "xls", "csv", "txt", "jpg", "jpeg", "png", "webp"].includes(ext);
    });
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !existingNames.has(f.name))];
    });
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    setResults((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const processFile = async (file: File) => {
    setProcessing(file.name);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.message ?? "Processing failed");
      setResults((prev) => ({ ...prev, [file.name]: { result: json.result, filename: json.filename } }));
    } catch (err) {
      setResults((prev) => ({ ...prev, [file.name]: { error: err instanceof Error ? err.message : "Failed" } }));
    } finally {
      setProcessing(null);
    }
  };

  const processAll = async () => {
    for (const file of files) {
      if (!results[file.name]) await processFile(file);
    }
  };

  const pending = files.filter((f) => !results[f.name]);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Files</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload financial documents for AI analysis — bank statements, invoices, spreadsheets, or images.
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">Drop files here or click to browse</p>
        <p className="text-xs text-gray-400">PDF, Excel (.xlsx/.xls), CSV, JPG, PNG — up to 25MB each</p>
        <input id="file-input" type="file" multiple accept={ACCEPTED} className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">{files.length} file{files.length !== 1 ? "s" : ""} selected</h2>
            {pending.length > 0 && (
              <button
                onClick={processAll}
                disabled={!!processing}
                className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Analyse {pending.length} file{pending.length !== 1 ? "s" : ""}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {files.map((file) => {
              const res = results[file.name];
              const isProcessing = processing === file.name;
              const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
              const typeKey = ["xlsx", "xls"].includes(ext) ? "excel" : ["jpg", "jpeg", "png", "webp"].includes(ext) ? "image" : ext === "pdf" ? "pdf" : "csv";

              return (
                <div key={file.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3">
                    {FILE_TYPE_ICONS[typeKey]}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isProcessing && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                      {!isProcessing && !res && (
                        <button
                          onClick={() => processFile(file)}
                          disabled={!!processing}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                        >
                          Analyse
                        </button>
                      )}
                      {res && "error" in res && <AlertCircle className="h-4 w-4 text-red-500" />}
                      {res && "result" in res && <CheckCircle className="h-4 w-4 text-green-500" />}
                      <button onClick={() => removeFile(file.name)} className="text-gray-400 hover:text-gray-600 ml-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Result */}
                  {res && "error" in res && (
                    <div className="border-t border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{res.error}</div>
                  )}
                  {res && "result" in res && (
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: "Credits", value: `$${res.result.summary.totalCredits.toLocaleString()}`, color: "text-green-600" },
                          { label: "Debits", value: `$${res.result.summary.totalDebits.toLocaleString()}`, color: "text-red-600" },
                          { label: "Net", value: `$${res.result.summary.netChange.toLocaleString()}`, color: "text-blue-600" },
                          { label: "Transactions", value: res.result.summary.transactionCount.toString(), color: "text-gray-900" },
                        ].map((s) => (
                          <div key={s.label} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {res.result.insights && res.result.insights.length > 0 && (
                        <div className="bg-blue-50 rounded-lg border border-blue-100 p-3">
                          <p className="text-xs font-semibold text-blue-700 mb-2">AI Insights</p>
                          <ul className="space-y-1.5">
                            {res.result.insights.map((insight, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                <span className="text-blue-500 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {res.result.transactions.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 px-2 text-gray-500 font-medium">Date</th>
                                <th className="text-left py-2 px-2 text-gray-500 font-medium">Description</th>
                                <th className="text-left py-2 px-2 text-gray-500 font-medium">Category</th>
                                <th className="text-right py-2 px-2 text-gray-500 font-medium">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {res.result.transactions.slice(0, 10).map((tx, i) => (
                                <tr key={i} className="border-b border-gray-100">
                                  <td className="py-1.5 px-2 text-gray-600">{tx.date}</td>
                                  <td className="py-1.5 px-2 text-gray-800">{tx.description}</td>
                                  <td className="py-1.5 px-2">
                                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{tx.category}</span>
                                  </td>
                                  <td className={`py-1.5 px-2 text-right font-medium ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                                    {tx.type === "credit" ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {res.result.transactions.length > 10 && (
                            <p className="text-xs text-gray-400 mt-2 text-center">
                              Showing 10 of {res.result.transactions.length} transactions
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          <p>Supported formats: Bank statements, invoices, receipts, payslips, balance sheets</p>
          <p className="mt-1">PDF · Excel · CSV · Images</p>
        </div>
      )}

      <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">Your files are processed securely</p>
          <p className="text-blue-600 text-xs mt-0.5">
            Documents are analysed by AI and not permanently stored. For formal document submission, use{" "}
            <Link href="/client/documents" className="underline">Documents</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
