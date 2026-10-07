"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, RotateCcw, SendHorizontal } from "lucide-react";
import { greeting, suggestedQuestions } from "@/data/assistant";
import { person } from "@/data/profile";
import { cn } from "@/lib/utils";
import { useChat } from "./chat-provider";

interface SectionLink { label: string; href: string }
interface Message { id: number; role: "user" | "assistant"; content: string; links?: SectionLink[] }

const welcome: Message = { id: 0, role: "assistant", content: greeting };
const MAX_LENGTH = 600;

/** Turns URLs and email addresses inside an answer into links. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          const clean = part.replace(/[.,]$/, "");
          return (
            <a key={i} href={clean} target="_blank" rel="noopener noreferrer" className="break-all text-accent-deep underline underline-offset-2">
              {clean.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          );
        }
        if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
          const clean = part.replace(/\.$/, "");
          return <a key={i} href={`mailto:${clean}`} className="break-all text-accent-deep underline underline-offset-2">{clean}</a>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function ChatWidget() {
  const { open, openChat, closeChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const nextId = useRef(1);
  const conversation = useRef(0); // bumps on "new conversation" so late replies are dropped
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeChat(); };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [open, closeChat]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim().slice(0, MAX_LENGTH);
      if (!question || pending) return;

      const userMessage: Message = { id: nextId.current++, role: "user", content: question };
      const history = [...messages, userMessage];
      setMessages(history);
      setInput("");
      setPending(true);
      const thisConversation = conversation.current;

      let reply: Omit<Message, "id">;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          // The greeting is UI text, not part of the conversation sent to the server.
          body: JSON.stringify({ messages: history.filter((m) => m.id !== 0).map(({ role, content }) => ({ role, content })) }),
        });
        const data = await res.json();
        reply = res.ok
          ? { role: "assistant", content: data.answer, links: data.links }
          : { role: "assistant", content: data.error || "Something went wrong. Please try again." };
      } catch {
        reply = { role: "assistant", content: "I could not reach the server. Check your connection and try again." };
      }

      if (thisConversation !== conversation.current) return;
      setMessages((prev) => [...prev, { id: nextId.current++, ...reply }]);
      setPending(false);
    },
    [messages, pending],
  );

  const newConversation = () => {
    conversation.current += 1;
    setMessages([welcome]);
    setPending(false);
    setInput("");
    inputRef.current?.focus();
  };

  const minimize = () => {
    closeChat();
    setTimeout(() => launcherRef.current?.focus(), 50);
  };

  const followLink = () => {
    // On small screens the panel covers the page, so get out of the way.
    if (window.matchMedia("(max-width: 639px)").matches) closeChat();
  };

  const fresh = messages.length === 1;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            ref={launcherRef}
            type="button"
            onClick={openChat}
            aria-haspopup="dialog"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-accent py-2 pl-2 pr-5 font-medium text-white shadow-panel transition-colors hover:bg-accent-deep sm:bottom-6 sm:right-6"
          >
            <Image src={person.photo} alt="" width={36} height={36} className="size-9 rounded-full border-2 border-white/80 object-cover object-top" />
            Ask Priyanka
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ask Priyanka, portfolio assistant"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-2 bottom-2 top-3 z-50 flex origin-bottom-right flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-panel sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(40rem,calc(100dvh-3rem))] sm:w-[25.5rem]"
          >
            <header className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Image src={person.photo} alt="" width={40} height={40} className="size-10 rounded-full border border-line object-cover object-top" />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg leading-tight">Ask Priyanka</h2>
                <p className="truncate text-xs text-muted">Answers come only from this portfolio</p>
              </div>
              <button type="button" onClick={newConversation} disabled={fresh && !pending} aria-label="New conversation" title="New conversation" className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink disabled:opacity-40">
                <RotateCcw className="size-4" />
              </button>
              <button type="button" onClick={minimize} aria-label="Minimize chat" title="Minimize" className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink">
                <Minus className="size-5" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-surface/60 px-4 py-5" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div className="max-w-[88%]">
                    <p
                      className={cn(
                        "whitespace-pre-line rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed",
                        message.role === "user" ? "rounded-br-md bg-accent text-white" : "rounded-bl-md border border-line bg-white text-ink",
                      )}
                    >
                      {message.role === "assistant" ? <RichText text={message.content} /> : message.content}
                    </p>
                    {message.links && message.links.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {message.links.map((link) => (
                          <li key={link.href}>
                            <a href={link.href} onClick={followLink} className="inline-flex rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-deep transition-colors hover:border-accent">
                              Go to {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}

              {pending && (
                <div className="flex justify-start" role="status" aria-label="Assistant is typing">
                  <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3.5">
                    <span className="typing-dot size-1.5 rounded-full bg-muted" />
                    <span className="typing-dot size-1.5 rounded-full bg-muted" />
                    <span className="typing-dot size-1.5 rounded-full bg-muted" />
                  </div>
                </div>
              )}

              {fresh && !pending && (
                <ul className="flex flex-wrap gap-2 pt-1" aria-label="Suggested questions">
                  {suggestedQuestions.map((question) => (
                    <li key={question}>
                      <button type="button" onClick={() => send(question)} className="rounded-full border border-line bg-white px-3.5 py-2 text-left text-sm text-ink transition-colors hover:border-accent hover:text-accent-deep">
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-end gap-2 border-t border-line bg-white p-3"
            >
              <label htmlFor="chat-input" className="sr-only">Your question</label>
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_LENGTH}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                placeholder="Ask about her experience or skills"
                className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-line bg-surface px-4 py-2.5 text-[0.95rem] placeholder:text-muted/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <button type="submit" disabled={!input.trim() || pending} aria-label="Send question" className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-white transition-colors hover:bg-accent-deep disabled:bg-line disabled:text-muted">
                <SendHorizontal className="size-[1.1rem]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
