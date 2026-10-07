import { NextResponse } from "next/server";

export const runtime = "nodejs";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const field = (k: string, max: number) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");
  const name = field("name", 100);
  const email = field("email", 200);
  const subject = field("subject", 150);
  const message = field("message", 4000);

  // Honeypot: real visitors never fill this field.
  if (field("company", 100)) return NextResponse.json({ ok: true });

  if (name.length < 2 || !isEmail(email) || subject.length < 3 || message.length < 10) {
    return NextResponse.json({ error: "Check the form fields and try again." }, { status: 400 });
  }

  const endpoint = process.env.CONTACT_FORM_ENDPOINT;
  if (!endpoint) {
    // No delivery service configured: the client opens the visitor's email app instead.
    return NextResponse.json({ ok: false, fallback: "mailto" });
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Form endpoint responded with ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json({ ok: false, fallback: "mailto" });
  }
}
