"use client";

import { useState, useRef, useEffect } from "react";
import { X, Bot, Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ChatMessage, Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import Link from "next/link";

const MAX_FREE_MESSAGES = 5;
const STORAGE_KEY = "taxable_chat_count";

interface ChatWindowProps {
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hello! I'm the Taxable AI assistant. I can help you with questions about taxation, accounting, audits, and our services across Pakistan, UK, USA, Saudi Arabia, and UAE. How can I assist you today?",
    timestamp: new Date(),
  },
];

const suggestedQuestions = [
  "What's the UK CGT rate on crypto in 2025-26?",
  "How does the Pakistan Super Tax work for companies?",
  "What FBAR penalties apply for US expats?",
  "Explain ZATCA e-invoicing requirements for Saudi Arabia",
];

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);
    setMsgCount(stored);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isLimitReached = msgCount >= MAX_FREE_MESSAGES;

  const handleSendMessage = async (content: string) => {
    if (isLimitReached) return;

    const newCount = msgCount + 1;
    setMsgCount(newCount);
    localStorage.setItem(STORAGE_KEY, String(newCount));

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) throw new Error("Stream failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const payload = line.slice(6);
            if (payload === "[DONE]") break;
            try {
              const { text } = JSON.parse(payload);
              accumulated += text;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m))
              );
            } catch { /* skip malformed chunk */ }
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "I'm having trouble connecting right now. Please email us at hello@taxable.ai or try again in a moment.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[500px] shadow-2xl">
      <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between space-y-0 p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Taxable AI Assistant</h3>
            <p className="text-xs opacity-80 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {isLimitReached
                ? "Free limit reached"
                : `${MAX_FREE_MESSAGES - msgCount} free message${MAX_FREE_MESSAGES - msgCount === 1 ? "" : "s"} remaining`}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="flex gap-1">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="h-2 w-2 bg-primary/50 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {messages.length === 1 && !isLoading && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-muted-foreground">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1.5 px-3"
                  onClick={() => handleSendMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="flex-shrink-0 p-4 border-t">
        {isLimitReached ? (
          <div className="w-full text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>You&apos;ve used your {MAX_FREE_MESSAGES} free messages</span>
            </div>
            <div className="flex gap-2 justify-center">
              <Link href="/auth/register">
                <Button size="sm" className="text-xs">Create Free Account</Button>
              </Link>
              <Link href="/auth/login">
                <Button size="sm" variant="outline" className="text-xs">Sign In</Button>
              </Link>
            </div>
          </div>
        ) : (
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        )}
      </CardFooter>
    </Card>
  );
}
