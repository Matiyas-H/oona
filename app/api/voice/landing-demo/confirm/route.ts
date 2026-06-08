import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory store for the last expert answer (Oona has no redis). Single-
// instance demo: the asker's relayAnswer tool POSTs here, and the browser polls
// GET here. The browser then sends the answer into the LIVE call over the
// WebSocket it already owns (sendContextUpdate) — no server-side UV inject.
const g = globalThis as any;
if (!g.__lunaAnswer) g.__lunaAnswer = { answer: null as string | null, escId: null as string | null };

// POST — the asker agent (on the phone) relays its clean summary here.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const answer: string = body.answer || "";
    const escId: string = body.escId || "";
    if (!answer) return NextResponse.json({ error: "No answer provided" }, { status: 400 });

    g.__lunaAnswer = { answer, escId };

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
  return NextResponse.json(g.__lunaAnswer || { answer: null, escId: null });
}

// DELETE — the browser clears any stale answer when a new escalation begins.
export async function DELETE() {
  g.__lunaAnswer = { answer: null, escId: null };
  return NextResponse.json({ ok: true });
}
