import { NextRequest, NextResponse } from "next/server";
import { claude, CLAUDE_MODEL } from "@/lib/claude/client";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
import * as XLSX from "xlsx";

const ACCEPTED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
  "application/vnd.ms-excel": "excel",
  "text/csv": "csv",
  "text/plain": "csv",
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
};

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
  insights: string[];
}

function buildResult(transactions: Transaction[], insights: string[]): ProcessingResult {
  const totalCredits = transactions.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebits = transactions.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const categoryMap = new Map<string, number>();
  transactions.forEach((t) => categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + t.amount));
  const total = totalCredits + totalDebits || 1;
  const categories = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({ category, amount, percentage: Math.round((amount / total) * 1000) / 10 }))
    .sort((a, b) => b.amount - a.amount);
  return { transactions, summary: { totalCredits, totalDebits, netChange: totalCredits - totalDebits, transactionCount: transactions.length }, categories, insights };
}

async function analyseText(text: string, filename: string): Promise<ProcessingResult> {
  const response = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    messages: [{ role: "user", content: `You are a financial document analyst. Analyse this document from "${filename}" and extract transactions.\n\nReturn ONLY valid JSON with this structure:\n{"transactions":[{"date":"YYYY-MM-DD","description":"string","amount":number,"type":"credit"|"debit","category":"string"}],"insights":["string","string","string"]}\n\nRules: amount is always positive; category: Income, Shopping, Utilities, Groceries, Transport, Dining, Entertainment, Health, Investment, Tax, Other; insights: 3 actionable tax or spending observations.\n\nDocument:\n${text.slice(0, 8000)}` }],
  });
  const raw = response.content[0].type === "text" ? response.content[0].text : "{}";
  const parsed = JSON.parse(raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()) as { transactions: Transaction[]; insights: string[] };
  return buildResult(parsed.transactions ?? [], parsed.insights ?? []);
}

async function analyseImage(buffer: Buffer, mimeType: string, filename: string): Promise<ProcessingResult> {
  const base64 = buffer.toString("base64");
  const response = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          source: { type: "base64", media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: base64 },
        },
        {
          type: "text",
          text: `Analyse this financial document image "${filename}" and extract all transactions. Return ONLY valid JSON:\n{"transactions":[{"date":"YYYY-MM-DD","description":"string","amount":number,"type":"credit"|"debit","category":"string"}],"insights":["string","string","string"]}`,
        },
      ],
    }],
  });
  const raw = response.content[0].type === "text" ? response.content[0].text : "{}";
  const parsed = JSON.parse(raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()) as { transactions: Transaction[]; insights: string[] };
  return buildResult(parsed.transactions ?? [], parsed.insights ?? []);
}

function excelToText(buffer: Buffer): string {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  return workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    return `Sheet: ${name}\n${XLSX.utils.sheet_to_csv(sheet)}`;
  }).join("\n\n");
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: true, message: "AI service not configured. Please contact support." }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: true, message: "No file provided" }, { status: 400 });

    const fileType = ACCEPTED_TYPES[file.type];
    if (!fileType) {
      return NextResponse.json(
        { error: true, message: `Unsupported file type. Accepted: PDF, Excel (.xlsx/.xls), CSV, or image (JPG/PNG/WebP).` },
        { status: 400 }
      );
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: true, message: "File size exceeds 25MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let result: ProcessingResult;

    if (fileType === "pdf") {
      const { text } = await pdfParse(buffer);
      result = await analyseText(text, file.name);
    } else if (fileType === "excel") {
      const text = excelToText(buffer);
      result = await analyseText(text, file.name);
    } else if (fileType === "csv") {
      result = await analyseText(buffer.toString("utf-8"), file.name);
    } else {
      result = await analyseImage(buffer, file.type, file.name);
    }

    return NextResponse.json({ success: true, filename: file.name, size: file.size, fileType, result, processedAt: new Date().toISOString() });
  } catch (error) {
    console.error("[upload] error:", error);
    return NextResponse.json({ error: true, message: "Failed to process document." }, { status: 500 });
  }
}
