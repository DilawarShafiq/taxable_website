"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Send, Bot, ChevronDown, ChevronRight, RotateCcw, Paperclip, X,
  Sparkles, FileText, Shield, TrendingUp, Scale, Copy, Check,
  Zap, Brain, ChevronUp, Hash,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { JURISDICTION_OPTIONS } from "@/lib/constants";

const STORAGE_KEY = "taxable_assistant_history_v2";
const STORAGE_SESSION_KEY = "taxable_assistant_session_id";
const MAX_HISTORY_MESSAGES = 20; // Keep last 20 messages for context (token efficiency)

// Save messages to DB (best-effort — falls back to localStorage only)
async function saveMessagesToDb(sessionId: string, newMessages: Message[]) {
  try {
    await fetch("/api/client/chat-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "append",
        sessionId,
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
          thinking: m.thinking,
          agent: m.agent,
          files: m.files,
        })),
      }),
    });
  } catch { /* DB unavailable — localStorage already has it */ }
}

async function createDbSession(agentType: string, jurisdictions: string[]): Promise<string | null> {
  try {
    const res = await fetch("/api/client/chat-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", agentType, jurisdictions }),
    });
    const json = await res.json() as { sessionId?: string };
    return json.sessionId ?? null;
  } catch { return null; }
}

type AgentType = "tax_advisor" | "document_analyzer" | "compliance_monitor" | "market_analyst" | "general";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  files?: string[];
  agent?: AgentType;
  timestamp?: number;
}

const AGENT_META: Record<AgentType, { label: string; color: string; darkColor: string; icon: React.ElementType; description: string }> = {
  tax_advisor:        {
    label: "Tax Advisor",
    description: "Income tax, CGT, corporate tax, planning",
    color: "text-violet-600 bg-violet-50 border-violet-200",
    darkColor: "bg-violet-600/15 text-violet-300 border-violet-600/25",
    icon: Scale,
  },
  document_analyzer:  {
    label: "Doc Analyzer",
    description: "Upload & analyse statements, invoices, returns",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    darkColor: "bg-blue-600/15 text-blue-300 border-blue-600/25",
    icon: FileText,
  },
  compliance_monitor: {
    label: "Compliance",
    description: "Filing deadlines, penalties, regulatory requirements",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    darkColor: "bg-amber-600/15 text-amber-300 border-amber-600/25",
    icon: Shield,
  },
  market_analyst:     {
    label: "Markets",
    description: "Investments, capital gains, portfolio tax planning",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    darkColor: "bg-emerald-600/15 text-emerald-300 border-emerald-600/25",
    icon: TrendingUp,
  },
  general:            {
    label: "General",
    description: "Auto-routes to the best specialist agent",
    color: "text-slate-600 bg-slate-50 border-slate-200",
    darkColor: "bg-slate-700/30 text-slate-300 border-slate-600/25",
    icon: Bot,
  },
};

const STARTERS_BY_AGENT: Record<AgentType, string[]> = {
  tax_advisor: [
    "What are the FBR income tax brackets for 2024-25?",
    "How do I calculate UK CGT on crypto disposals?",
    "UAE Corporate Tax — who needs to register and when?",
    "Pakistan super tax — who pays and at what rate?",
    "UK R&D Tax Credit — how much can I claim?",
    "IFRS 16 lease accounting — how does it affect my P&L?",
    "What is Section 7E deemed income tax in Pakistan?",
    "How does GILTI affect a US person owning a UAE company?",
  ],
  document_analyzer: [
    "Analyse this bank statement for tax implications",
    "Extract transactions from my uploaded CSV",
    "Review my P60 and calculate my tax position",
    "Identify deductible expenses in this invoice list",
  ],
  compliance_monitor: [
    "What are all my HMRC deadlines for this year?",
    "When is my FBR return due and what are the penalties?",
    "Am I required to register for VAT in Saudi Arabia?",
    "What are the MTD for ITSA requirements from 2026?",
  ],
  market_analyst: [
    "Compare S&P 500 vs KSE-100 after-tax returns",
    "What is the most tax-efficient way to invest in the UK?",
    "Pakistan CGT on listed shares — holding period rules",
    "Should I use an ISA or general investment account?",
  ],
  general: [
    "What are the FBR income tax brackets for 2024-25?",
    "How do I calculate UK CGT on crypto disposals?",
    "UAE Corporate Tax — who needs to register and when?",
    "Pakistan super tax — who pays and at what rate?",
    "What is Section 7E deemed income tax in Pakistan?",
    "How does GILTI affect a US person owning a UAE company?",
    "IFRS 16 lease accounting — how does it affect my P&L?",
    "Walk me through a DCF business valuation",
  ],
};

const JURISDICTIONS = JURISDICTION_OPTIONS.map(({ value, label }) => ({
  value,
  label: label.replace("United Kingdom", "UK").replace("United States", "USA").replace("Saudi Arabia", "Saudi"),
  flag: { pakistan: "🇵🇰", uk: "🇬🇧", usa: "🇺🇸", saudi: "🇸🇦", uae: "🇦🇪" }[value] ?? "🌍",
}));

function AgentBadge({ agent, size = "sm" }: { agent: AgentType; size?: "sm" | "xs" }) {
  const meta = AGENT_META[agent] ?? AGENT_META.general;
  const Icon = meta.icon;
  const cls = size === "xs"
    ? `inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${meta.color}`
    : `inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.color}`;
  return (
    <span className={cls}>
      <Icon className={size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3"} />
      {meta.label}
    </span>
  );
}

function ThinkingBlock({ thinking }: { thinking: string }) {
  const [open, setOpen] = useState(false);
  const wordCount = thinking.split(/\s+/).length;
  return (
    <div className="mb-3 rounded-xl border border-violet-100 bg-violet-50/50 text-xs overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-violet-600 hover:text-violet-800 hover:bg-violet-50 transition-colors"
      >
        <Brain className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
        <span className="flex-1 text-left font-semibold">Extended reasoning</span>
        <span className="text-violet-400 mr-1">{wordCount} words</span>
        {open ? <ChevronUp className="h-3 w-3 text-violet-400" /> : <ChevronDown className="h-3 w-3 text-violet-400" />}
      </button>
      {open && (
        <div className="border-t border-violet-100 px-3 py-3 font-mono text-[11px] text-violet-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto bg-white/50">
          {thinking}
        </div>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
      title="Copy response"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function UserMessage({ msg }: { msg: Message }) {
  return (
    <div className="flex justify-end mb-5 px-4 lg:px-6">
      <div className="max-w-[80%] lg:max-w-[70%]">
        <div className="bg-slate-900 text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
          <p className="whitespace-pre-wrap">{msg.content}</p>
        </div>
        {msg.files && msg.files.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5 justify-end">
            {msg.files.map((f, i) => (
              <span key={i} className="text-[10px] bg-slate-100 text-slate-500 rounded-lg px-2 py-0.5 flex items-center gap-1 border border-slate-200">
                <FileText className="h-2.5 w-2.5" />{f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const mdClass = [
  "text-sm text-slate-800 leading-relaxed",
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
  "[&_p]:mb-3 [&_p:last-child]:mb-0",
  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul:last-child]:mb-0",
  "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol:last-child]:mb-0",
  "[&_li]:mb-1",
  "[&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-2.5 [&_h1]:mt-5 [&_h1]:text-slate-900",
  "[&_h2]:text-sm [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-slate-900",
  "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-slate-800",
  "[&_strong]:font-semibold [&_strong]:text-slate-900",
  "[&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-xs [&_code]:font-mono [&_code]:text-slate-700",
  "[&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:my-3 [&_pre]:shadow-md",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-100",
  "[&_blockquote]:border-l-3 [&_blockquote]:border-violet-300 [&_blockquote]:pl-3 [&_blockquote]:text-slate-500 [&_blockquote]:italic [&_blockquote]:my-3",
  "[&_hr]:border-slate-200 [&_hr]:my-4",
  "[&_table]:w-full [&_table]:text-xs [&_table]:border-collapse [&_table]:my-3 [&_table]:rounded-lg [&_table]:overflow-hidden",
  "[&_th]:text-left [&_th]:font-semibold [&_th]:border-b [&_th]:border-slate-200 [&_th]:px-3 [&_th]:py-2 [&_th]:bg-slate-50 [&_th]:text-slate-700",
  "[&_td]:border-b [&_td]:border-slate-100 [&_td]:px-3 [&_td]:py-2",
  "[&_tr:last-child_td]:border-b-0",
  "[&_tr:hover_td]:bg-slate-50/80",
].join(" ");

function AssistantMessage({ msg, streaming }: { msg: Message; streaming: boolean }) {
  return (
    <div className="group flex gap-3 mb-5 px-4 lg:px-6">
      <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-sm mt-0.5">
        <Bot className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          {msg.agent && msg.agent !== "general" && <AgentBadge agent={msg.agent} size="xs" />}
          {msg.content && !streaming && <CopyButton text={msg.content} />}
        </div>
        {msg.thinking && <ThinkingBlock thinking={msg.thinking} />}
        {msg.content ? (
          <div className={mdClass}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>
        ) : streaming ? (
          <span className="inline-flex gap-1 items-center mt-1">
            <span className="h-1.5 w-1.5 bg-violet-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 bg-violet-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 bg-violet-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function ClientAssistantPage() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>([]);
  const [useThinking, setUseThinking] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [agentMode, setAgentMode] = useState<AgentType>("general");
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [dbSessionId, setDbSessionId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved) as Message[]);
      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) setDbSessionId(savedSession);
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // Persist history (last 20 messages for token efficiency)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY_MESSAGES)));
    } catch { /* ignore */ }
  }, [messages, hydrated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setShowAgentPicker(false);

    let content = text.trim();

    if (files.length > 0) {
      for (const file of files) {
        try {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const json = await res.json();
          if (json.result) {
            const s = json.result.summary ?? {};
            const cats = (json.result.categories ?? []) as { category: string; amount: number; percentage: number }[];
            const txns = (json.result.transactions ?? []) as { date: string; description: string; amount: number; type: string; category: string }[];
            const insights = (json.result.insights ?? []) as string[];
            content += `\n\n[Document: ${file.name}]
Transactions: ${s.transactionCount ?? 0} | Credits: ${s.totalCredits ?? 0} | Debits: ${s.totalDebits ?? 0} | Net: ${s.netChange ?? 0}
Categories: ${cats.map((c) => `${c.category}(${c.percentage}%)`).join(", ")}
Insights: ${insights.slice(0, 5).join(" | ")}
Transactions (sample):
${txns.slice(0, 25).map((t) => `${t.date}|${t.description}|${t.type === "credit" ? "+" : "-"}${t.amount}|${t.category}`).join("\n")}
Analyse for tax implications.`;
          }
        } catch { /* ignore */ }
      }
    }

    // Create DB session on first message of a new conversation (best-effort)
    let currentSessionId = dbSessionId;
    if (!currentSessionId && messages.length === 0) {
      currentSessionId = await createDbSession(agentMode, selectedJurisdictions);
      if (currentSessionId) {
        setDbSessionId(currentSessionId);
        try { localStorage.setItem(STORAGE_SESSION_KEY, currentSessionId); } catch { /* ignore */ }
      }
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
      files: files.map((f) => f.name),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setFiles([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    const assistantId = `a-${Date.now()}`;
    setStreamingId(assistantId);
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", timestamp: Date.now() }]);

    // Token efficiency: only send last N messages as context
    const history = [...messages, userMsg]
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/client/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          jurisdictions: selectedJurisdictions.length > 0 ? selectedJurisdictions : undefined,
          thinking: useThinking,
          agentType: agentMode !== "general" ? agentMode : undefined,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let thinkingBuf = "";
      let textBuf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") break;
          try {
            const chunk = JSON.parse(payload) as { type: string; text?: string; agent?: AgentType };
            if (chunk.type === "agent" && chunk.agent) {
              setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, agent: chunk.agent } : m));
            } else if (chunk.type === "thinking" && chunk.text) {
              thinkingBuf += chunk.text;
              setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, thinking: thinkingBuf } : m));
            } else if (chunk.type === "text" && chunk.text) {
              textBuf += chunk.text;
              setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: textBuf } : m));
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages((prev) => prev.map((m) =>
        m.id === assistantId
          ? { ...m, content: "Connection failed. Please check your network and try again. If the problem persists, contact support." }
          : m
      ));
    } finally {
      setLoading(false);
      setStreamingId(null);

      // Persist completed exchange to DB (best-effort)
      if (currentSessionId) {
        setMessages((prev) => {
          const lastTwo = prev.slice(-2);
          if (lastTwo.length === 2 && lastTwo[0].role === "user" && lastTwo[1].role === "assistant" && lastTwo[1].content) {
            saveMessagesToDb(currentSessionId!, lastTwo);
          }
          return prev;
        });
      }
    }
  }, [loading, messages, selectedJurisdictions, useThinking, files, agentMode, dbSessionId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const clearConversation = () => {
    setMessages([]);
    setInput("");
    setFiles([]);
    setDbSessionId(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch { /* ignore */ }
  };

  const isEmpty = messages.length === 0;
  const starters = STARTERS_BY_AGENT[agentMode];
  const currentAgentMeta = AGENT_META[agentMode];
  const CurrentAgentIcon = currentAgentMeta.icon;

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Top bar */}
      <div className="flex-shrink-0 border-b border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 gap-3">
          {/* Left: agent selector */}
          <div className="relative">
            <button
              onClick={() => setShowAgentPicker((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all group"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-600">
                <CurrentAgentIcon className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">{currentAgentMeta.label}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Agent mode</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
            </button>

            {/* Agent picker dropdown */}
            {showAgentPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAgentPicker(false)} />
                <div className="absolute top-full mt-1.5 left-0 z-20 w-64 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Select Agent</p>
                  </div>
                  {(Object.entries(AGENT_META) as [AgentType, typeof AGENT_META[AgentType]][]).map(([key, meta]) => {
                    const Icon = meta.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => { setAgentMode(key); setShowAgentPicker(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors ${agentMode === key ? "bg-violet-50" : ""}`}
                      >
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${agentMode === key ? "bg-violet-500" : "bg-slate-100"}`}>
                          <Icon className={`h-3.5 w-3.5 ${agentMode === key ? "text-white" : "text-slate-500"}`} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-slate-800">{meta.label}</p>
                          <p className="text-[10px] text-slate-400">{meta.description}</p>
                        </div>
                        {agentMode === key && <Check className="h-3.5 w-3.5 text-violet-500 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-2">
            {/* Context counter */}
            {messages.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                <Hash className="h-3 w-3" />
                {Math.min(messages.length, MAX_HISTORY_MESSAGES)} / {MAX_HISTORY_MESSAGES} ctx
              </div>
            )}

            {/* Deep thinking toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setUseThinking((v) => !v)}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors flex-shrink-0 ${useThinking ? "bg-violet-500" : "bg-slate-200"}`}
              >
                <span className={`inline-block h-3 w-3 rounded-full bg-white shadow-sm transform transition-transform ${useThinking ? "translate-x-3.5" : "translate-x-0.5"}`} />
              </button>
              <Sparkles className={`h-3 w-3 ${useThinking ? "text-violet-500" : "text-slate-300"}`} />
              <span className="text-[11px] text-slate-400 hidden md:block">Reasoning</span>
            </label>

            {/* New conversation */}
            {!isEmpty && (
              <button
                onClick={clearConversation}
                className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:block">New</span>
              </button>
            )}
          </div>
        </div>

        {/* Jurisdiction filter */}
        <div className="flex items-center gap-1.5 px-4 pb-2.5 overflow-x-auto">
          <span className="text-[10px] text-slate-400 mr-0.5 flex-shrink-0">Focus:</span>
          {JURISDICTIONS.map((j) => (
            <button
              key={j.value}
              onClick={() => setSelectedJurisdictions((prev) =>
                prev.includes(j.value) ? prev.filter((x) => x !== j.value) : [...prev, j.value]
              )}
              className={`flex-shrink-0 flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border transition-all ${
                selectedJurisdictions.includes(j.value)
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "text-slate-500 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <span>{j.flag}</span>
              {j.label}
            </button>
          ))}
          {selectedJurisdictions.length > 0 && (
            <button
              onClick={() => setSelectedJurisdictions([])}
              className="flex-shrink-0 text-[10px] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-0.5 ml-0.5"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center max-w-2xl mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg mb-4">
              <CurrentAgentIcon className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {firstName ? `Hi ${firstName}` : "Taxable AI"}
            </h2>
            <p className="text-sm text-slate-500 mb-1 font-medium">{currentAgentMeta.description}</p>
            <p className="text-xs text-slate-400 mb-6 max-w-sm">
              {agentMode === "general"
                ? "Auto-routes to the best specialist: Tax Advisor, Document Analyzer, Compliance Monitor, or Market Analyst."
                : `You are speaking directly to the ${currentAgentMeta.label}. Switch agents using the selector above.`}
            </p>

            {/* Agent pills */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-6">
              {(Object.entries(AGENT_META) as [AgentType, typeof AGENT_META[AgentType]][])
                .filter(([k]) => k !== "general")
                .map(([key, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setAgentMode(key)}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                        agentMode === key ? meta.color + " shadow-sm" : "text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600"
                      }`}
                    >
                      <Icon className="h-3 w-3" />{meta.label}
                    </button>
                  );
                })}
            </div>

            {/* Starter questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {starters.slice(0, 8).map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={loading}
                  className="text-left text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 hover:bg-slate-100 hover:border-slate-300 hover:shadow-sm transition-all disabled:opacity-50 leading-relaxed"
                >
                  <ChevronRight className="h-3 w-3 text-slate-400 inline mr-1" />
                  {q}
                </button>
              ))}
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-400" /> Streaming responses
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full flex items-center gap-1">
                <Brain className="h-3 w-3 text-violet-400" /> Extended reasoning
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full flex items-center gap-1">
                <FileText className="h-3 w-3 text-blue-400" /> Document analysis
              </span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) =>
              msg.role === "user"
                ? <UserMessage key={msg.id} msg={msg} />
                : <AssistantMessage key={msg.id} msg={msg} streaming={msg.id === streamingId} />
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-slate-100 bg-white px-4 py-3">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {files.map((f, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-lg px-2.5 py-1.5 shadow-sm">
                <FileText className="h-3 w-3 flex-shrink-0" />
                <span className="max-w-32 truncate">{f.name}</span>
                <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100 ml-0.5 flex-shrink-0">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!).slice(0, 3)]);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors mb-0.5"
            title="Attach document (PDF, Excel, CSV, image)"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-slate-400 focus-within:bg-white transition-all shadow-sm">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${currentAgentMeta.label.toLowerCase() === "general" ? "anything" : currentAgentMeta.label.toLowerCase()}…`}
              rows={1}
              disabled={loading}
              className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent resize-none outline-none leading-relaxed disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{ maxHeight: 180 }}
            />
          </div>
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm mb-0.5"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-300 text-center mt-1.5">
          Enter to send · Shift+Enter new line · Attach up to 3 files · Last {MAX_HISTORY_MESSAGES} messages in context
        </p>
      </div>
    </div>
  );
}
