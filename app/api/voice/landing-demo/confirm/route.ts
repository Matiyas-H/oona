import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

// Persistent store (Upstash Redis) so the answer survives across serverless
// function instances — the asker's relayAnswer POST and the browser's poll GET
// land on different instances on Vercel, so in-memory does not work.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL_API || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN_API || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const ANSWER_KEY = "luna-demo:last-answer";

// POST — the asker agent (on the phone) relays its clean summary here.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const answer: string = body.answer || "";
    const escId: string = body.escId || "";
    if (!answer) return NextResponse.json({ error: "No answer provided" }, { status: 400 });

    await redis.set(ANSWER_KEY, JSON.stringify({ answer, escId }), { ex: 300 });

    return NextResponse.json({
      message: "Answer received. Thank the expert and end the call.",
    });
  } catch (err: any) {
    console.error("[landing-demo/confirm] error", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

// GET — the browser polls for the answer (escId-scoped so stale answers don't leak).
export async function GET() {
  try {
    const raw = (await redis.get(ANSWER_KEY)) as unknown;
    if (!raw) return NextResponse.json({ answer: null, escId: null });
    // Upstash may return the stored JSON as a string OR an already-parsed object.
    let obj: any = raw;
    if (typeof raw === "string") {
      try {
        obj = JSON.parse(raw);
      } catch {
        return NextResponse.json({ answer: raw, escId: null });
      }
    }
    if (obj && typeof obj === "object") {
      return NextResponse.json({ answer: obj.answer || null, escId: obj.escId || null });
    }
    return NextResponse.json({ answer: null, escId: null });
  } catch {
    return NextResponse.json({ answer: null, escId: null });
  }
}

// DELETE — the browser clears any stale answer when a new escalation begins.
export async function DELETE() {
  try {
    await redis.del(ANSWER_KEY);
  } catch {
    /* ignore */
  }
  return NextResponse.json({ ok: true });
}
