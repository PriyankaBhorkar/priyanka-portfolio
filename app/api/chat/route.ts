import { NextResponse } from "next/server";
import { answerFromKnowledge, buildSystemPrompt, linksFor } from "@/lib/assistant";

export const runtime = "nodejs";

interface ChatMessage { role: "user" | "assistant"; content: string }

const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY = 10;
const RATE_LIMIT = 20; // requests per minute, per visitor
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages: ChatMessage[] = [];
  for (const m of raw.slice(-MAX_HISTORY)) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const content = m.content.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (content) messages.push({ role: m.role, content });
  }
  // The API expects the conversation to start with, and end on, a visitor message.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

/** Calls the LLM with the portfolio knowledge base as its only context. Server-side only. */
async function askLlm(messages: ChatMessage[], apiKey: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: buildSystemPrompt(),
      messages,
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`LLM request failed with status ${res.status}`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = data.content?.filter((b) => b.type === "text").map((b) => b.text ?? "").join("").trim();
  if (!text) throw new Error("LLM returned an empty answer");
  return text;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many questions in a short time. Try again in a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = parseMessages(body);
  if (!messages) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const question = messages[messages.length - 1].content;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const answer = await askLlm(messages, apiKey);
      return NextResponse.json({ answer, links: linksFor(answer), mode: "llm" });
    } catch (error) {
      console.error("[ask-priyanka]", error);
      // Fall through to the built-in answers so the visitor still gets a reply.
    }
  }

  return NextResponse.json({ ...answerFromKnowledge(question), mode: "local" });
}
