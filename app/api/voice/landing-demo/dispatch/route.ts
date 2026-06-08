import { NextResponse } from "next/server";
import twilio from "twilio";

export const dynamic = "force-dynamic";

const ULTRAVOX_API_URL = "https://api.ultravox.ai/api/calls";

// The "asker" agent voice — calm male relaying the question to the expert.
const ASKER_VOICE = "Mark2";

/**
 * Places a REAL outbound phone call to a human expert (a team member's phone).
 * A small Ultravox agent on that call relays the user's deployment/compliance
 * question, understands the expert's reply, and POSTs a clean summary to
 * /confirm — which injects it back into the live Luna call.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const question: string = body.question || "a deployment question from a website visitor";
    const mainCallId: string | undefined = body.callId;
    const escId: string = body.escId || "";

    const apiKey = process.env.ULTRAVOX_API_KEY;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.LUNA_DEMO_FROM_NUMBER || process.env.TWILIO_PHONE_NUMBER;
    const expertNumber = process.env.LUNA_DEMO_EXPERT_NUMBER;

    if (!apiKey) return NextResponse.json({ error: "ULTRAVOX_API_KEY missing" }, { status: 500 });
    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json({ error: "Twilio creds missing" }, { status: 500 });
    }
    if (!expertNumber) {
      return NextResponse.json(
        { error: "LUNA_DEMO_EXPERT_NUMBER not set (the phone to ring)" },
        { status: 400 }
      );
    }

    // Public https URL Ultravox uses to call /confirm back. On the deployed site
    // this is the real domain; for local testing set LUNA_DEMO_PUBLIC_URL to a
    // tunnel. Ultravox only accepts https tool callback URLs.
    // On a Vercel preview, VERCEL_URL holds this deployment's own host (no
    // scheme) — use it so the asker's callback hits THIS preview, not prod.
    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
    const baseUrl =
      process.env.LUNA_DEMO_PUBLIC_URL ||
      vercelUrl ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "https://omnia-voice.com";
    const relayReachable = baseUrl.startsWith("https://");

    const systemPrompt = `You are an Omnia operations assistant placing a quick internal call to a human expert on the team. This is an outbound call — the expert answers and speaks first ("Hello?").

YOUR JOB: relay ONE question, understand the reply, send a clean summary back, and end the call.

THE QUESTION TO ASK: "${question}"

FLOW:
1. They answer. Say: "Hi, quick one from the Omnia voice assistant — a website visitor is asking: ${question}. What should I tell them?"
2. Listen and UNDERSTAND what they mean. People talk loosely; grasp the INTENT, don't transcribe words.
3. Call relayAnswer with a CLEAN one-or-two-sentence summary in plain language: (a) the actual answer (yes/no + key detail), and (b) any follow-up action (e.g. "collect the visitor's phone number"). Fix grammar, drop filler, keep every instruction.
   - Example: they mumble "oh yeah we do US HIPAA, get their number" → relay: "Yes, we support deployment in the US region for HIPAA workloads. Please collect the visitor's phone number so the team can follow up."
4. Then say "Got it, thank you — passing that on." and hang up.

CRITICAL: relayAnswer must be a clean, well-formed summary — never raw mumbled speech. Never end the call without calling relayAnswer.

RULES: short, natural.`;

    const callConfig = {
      systemPrompt,
      model: "ultravox-v0.6-llama3.3-70b",
      voice: ASKER_VOICE,
      languageHint: "en",
      firstSpeakerSettings: { user: {} },
      medium: { twilio: {} },
      maxDuration: "180s",
      selectedTools: [
        ...(relayReachable
          ? [
              {
                temporaryTool: {
                  modelToolName: "relayAnswer",
                  description: "Send your clean summary of the expert's answer back to the caller.",
                  dynamicParameters: [
                    {
                      name: "answer",
                      location: "PARAMETER_LOCATION_BODY",
                      schema: {
                        type: "string",
                        description:
                          "A CLEAN one-or-two-sentence summary of the expert's decision: the answer plus any follow-up action. Fix grammar, drop filler; never raw mumbled speech.",
                      },
                      required: true,
                    },
                  ],
                  staticParameters: [
                    ...(mainCallId
                      ? [{ name: "mainCallId", location: "PARAMETER_LOCATION_BODY", value: mainCallId }]
                      : []),
                    ...(escId
                      ? [{ name: "escId", location: "PARAMETER_LOCATION_BODY", value: escId }]
                      : []),
                  ],
                  http: {
                    baseUrlPattern: `${baseUrl}/api/voice/landing-demo/confirm`,
                    httpMethod: "POST",
                  },
                },
              },
            ]
          : []),
        { toolName: "hangUp" },
      ],
    };

    const uvRes = await fetch(ULTRAVOX_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body: JSON.stringify(callConfig),
    });

    if (!uvRes.ok) {
      const text = await uvRes.text();
      console.error("[landing-demo/dispatch] UV error", uvRes.status, text);
      return NextResponse.json({ error: `Ultravox error: ${text}` }, { status: uvRes.status });
    }

    const uvData = await uvRes.json();
    if (!uvData.joinUrl) {
      return NextResponse.json({ error: "No joinUrl from Ultravox" }, { status: 500 });
    }

    const client = twilio(accountSid, authToken);
    const call = await client.calls.create({
      twiml: `<Response><Connect><Stream url="${uvData.joinUrl}"/></Connect></Response>`,
      to: expertNumber,
      from: fromNumber,
    });

    console.log("[landing-demo/dispatch] expert call placed", call.sid);
    return NextResponse.json({ ok: true, callSid: call.sid });
  } catch (err: any) {
    console.error("[landing-demo/dispatch] error", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
