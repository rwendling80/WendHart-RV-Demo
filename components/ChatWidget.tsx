"use client";

import { useEffect, useRef, useState } from "react";

type DisplayMessage = { role: "user" | "assistant"; content: string };

const SESSION_STORAGE_KEY = "wendhart-chat-session-id";

function getOrCreateSessionId(): string {
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(SESSION_STORAGE_KEY, id);
  return id;
}

export function ChatWidget({ dealerName }: { dealerName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      role: "assistant",
      content: `Hi! I'm ${dealerName}'s AI assistant — ask me about any unit on the lot, or tell me what you're looking for.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isOpen]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const sessionId = getOrCreateSessionId();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Something went wrong — try again, or call the dealership directly.");
    } finally {
      setIsSending(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-forest px-5 py-3 text-base font-bold text-cream shadow-lg hover:bg-forest-dark"
      >
        Chat with us
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-lg border-2 border-charcoal/10 bg-white shadow-xl">
      <div className="flex items-center justify-between bg-charcoal px-4 py-3 text-cream">
        <p className="font-bold">{dealerName} Chat</p>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
          className="text-xl leading-none hover:text-forest-light"
        >
          &times;
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-lg bg-forest px-3 py-2 text-cream"
                : "mr-auto max-w-[85%] rounded-lg bg-charcoal/5 px-3 py-2 text-charcoal"
            }
          >
            {m.content}
          </div>
        ))}
        {isSending && (
          <div className="mr-auto max-w-[85%] rounded-lg bg-charcoal/5 px-3 py-2 text-charcoal-light">
            Typing…
          </div>
        )}
        {error && <p className="text-sm font-semibold text-rust">{error}</p>}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t-2 border-charcoal/10 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="rounded-md bg-forest px-4 py-2 text-base font-bold text-cream hover:bg-forest-dark disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
