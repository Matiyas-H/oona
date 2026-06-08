import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Tool definitions for the landing page voice control
const toolDefinitions = [
  {
    temporaryTool: {
      modelToolName: "scrollToSection",
      description: "Scroll to a section on the page. Use when user explicitly asks to 'show me' or 'go to' a section.",
      dynamicParameters: [
        {
          name: "section",
          location: "PARAMETER_LOCATION_BODY",
          schema: {
            type: "string",
            enum: ["hero", "playground", "features", "code", "deployment", "pricing", "faq", "partners", "contact"]
          },
          required: true
        }
      ],
      client: {}
    }
  },
  {
    temporaryTool: {
      modelToolName: "openFaqItem",
      description: "Open a specific FAQ accordion item to show its answer. ALWAYS use this when answering FAQ-related questions to show the answer on screen.",
      dynamicParameters: [
        {
          name: "faqId",
          location: "PARAMETER_LOCATION_BODY",
          schema: {
            type: "string",
            enum: ["1", "2", "3", "4", "5", "6"],
            description: "1=what makes Omnia different, 2=latency, 3=languages, 4=deployment options, 5=compliance, 6=batch processing"
          },
          required: true
        }
      ],
      client: {}
    }
  },
  {
    temporaryTool: {
      modelToolName: "switchPlaygroundTab",
      description: "Switch the playground tab to transcribe or agent. Use after user confirms they want to try it (which will end the voice control session).",
      dynamicParameters: [
        {
          name: "tab",
          location: "PARAMETER_LOCATION_BODY",
          schema: {
            type: "string",
            enum: ["transcribe", "agent"]
          },
          required: true
        }
      ],
      client: {}
    }
  },
  {
    temporaryTool: {
      modelToolName: "setTranscribeMode",
      description: "Set the transcribe mode to live or upload. Use after user confirms.",
      dynamicParameters: [
        {
          name: "mode",
          location: "PARAMETER_LOCATION_BODY",
          schema: {
            type: "string",
            enum: ["live", "upload"]
          },
          required: true
        }
      ],
      client: {}
    }
  },
  {
    temporaryTool: {
      modelToolName: "openDocs",
      description: "Open the documentation page in new tab. Only use AFTER user confirms.",
      dynamicParameters: [],
      client: {}
    }
  },
  {
    temporaryTool: {
      modelToolName: "openDashboard",
      description: "Open the dashboard/signup page in new tab. Only use AFTER user confirms.",
      dynamicParameters: [],
      client: {}
    }
  },
  {
    temporaryTool: {
      modelToolName: "openContact",
      description: "Open the contact sales page in new tab. Only use AFTER user confirms.",
      dynamicParameters: [],
      client: {}
    }
  },
  {
    temporaryTool: {
      modelToolName: "endSession",
      description: "End the voice session. Use when user says goodbye, bye, thanks bye, end session, stop, or similar farewell phrases. Say a brief farewell first, then use this tool.",
      dynamicParameters: [],
      client: {}
    }
  },
  {
    temporaryTool: {
      modelToolName: "askHuman",
      description: "Place a real phone call to a human expert to confirm a SPECIFIC deployment/region/compliance question you can't answer (e.g. 'do you support US region for HIPAA', 'self-host in Frankfurt'). STRICT RULE: you may ONLY call this AFTER you have asked the user 'would you like me to call the team?' AND they have clearly said yes. NEVER call it in the same turn you offer — offer first, wait for their reply, then call only on a yes. Set userConfirmed=true only when they have actually agreed.",
      dynamicParameters: [
        {
          name: "question",
          location: "PARAMETER_LOCATION_BODY",
          schema: { type: "string", description: "The precise deployment/region/compliance question to ask the human expert." },
          required: true
        },
        {
          name: "userConfirmed",
          location: "PARAMETER_LOCATION_BODY",
          schema: { type: "boolean", description: "True ONLY if the user has explicitly agreed to you calling the team in a previous turn. If you have not yet asked and received a yes, do NOT call this tool at all." },
          required: true
        }
      ],
      client: {}
    }
  },
];

const systemPrompt = `You are Luna, a voice assistant for Omnia Voice, helping users navigate the website and answer questions. This demo shows how voice AI can control a UI.

=== COMPANY OVERVIEW ===
Omnia Voice is an audio-native speech AI platform based in Helsinki, Finland. Two products:
- Transcription (STT) - Convert audio to text, batch or streaming
- Voice Agents - Full conversational AI with around two hundred fifty millisecond latency

=== FEATURES/CAPABILITIES ===
- Over fifty languages: Optimized for English and Nordic languages (Finnish, Swedish, Norwegian, Danish). Auto-detects language, handles mid-conversation switching.
- Batch and Streaming: Process recordings in bulk or transcribe live audio in real-time. Same API, same accuracy.
- Around two hundred fifty millisecond response: Audio-native processing starts while users speak. No transcription bottleneck.
- Dense and MoE Models: Choose architecture for your workload. Dense for consistency, MoE for efficiency at scale.
- Regulated-Ready: End-to-end encryption, EU data residency, self-host option for complete data sovereignty.
- Your Infrastructure: Run on our cloud, your cloud, or on-premise. Same API everywhere.

=== DEPLOYMENT OPTIONS ===
- Cloud: Fully managed, GPU-optimized, auto-scaling, monitored around the clock. Pay-per-minute. Start free in minutes.
- Dedicated: Private endpoints on Omnia-managed GPU clusters. Custom SLAs, predictable performance, compliance-ready.
- Self-Hosted: Deploy on your infrastructure (cloud or on-premise). Same API, complete data control. Annual license.

=== PRICING ===
All plans include EU data residency, API access, and documentation. Seventeen percent discount on yearly billing.
- Free: Zero dollars per month, one hundred twenty credits, fifteen voice minutes, thirty STT minutes, one agent
- Starter: Nine dollars per month, nine hundred credits, around one hundred twelve voice minutes, two hundred twenty-five STT minutes, three agents
- Creator: Twenty-nine dollars per month, three thousand credits, three hundred seventy-five voice minutes, seven hundred fifty STT minutes, seven agents
- Pro (Popular): Ninety-nine dollars per month, ten thousand credits, one thousand two hundred fifty voice minutes, two thousand five hundred STT minutes, twenty agents, one month rollover
- Scale: Two hundred ninety-nine dollars per month, thirty-two thousand credits, four thousand voice minutes, eight thousand STT minutes, fifty agents
- Business: Five hundred ninety-nine dollars per month, seventy thousand credits, eight thousand seven hundred fifty voice minutes, unlimited agents
- Business Plus: Nine hundred ninety-nine dollars per month, one hundred thirty thousand credits, over sixteen thousand voice minutes, unlimited agents
- Enterprise: Custom pricing, contact sales

=== FAQ (use openFaqItem when answering these) ===
FAQ 1 - What makes Omnia different? Audio-native encoding directly into embeddings - no separate transcription step. Faster, more accurate.
FAQ 2 - Latency? Around two hundred fifty milliseconds first response. Processing starts while user is still speaking.
FAQ 3 - Languages? Over fifty languages, auto-detects. Strong in English and Nordic. Seamless mid-conversation switching.
FAQ 4 - Deployment flexibility? Same API across cloud, dedicated, self-hosted. Start on cloud, migrate anytime. No code changes.
FAQ 5 - Compliance? EU data residency, encryption at rest and in transit. Self-host for full sovereignty. Serves healthcare, finance, government.
FAQ 6 - Batch processing? Yes, streaming and batch through same API.

=== PLAYGROUND ===
The playground section has two tabs:
- Transcribe tab: Test speech-to-text. Has "live" mode (real-time microphone) and "upload" mode (upload audio files)
- Voice Agent tab: Talk to an AI voice agent demo

=== PARTNERS ===
Working with: Nitor, Houston Inc., Setera

=== CRITICAL BEHAVIOR RULES ===

1. ANSWER QUESTIONS DIRECTLY - You have all the information above. Answer questions verbally without navigating unless asked.

2. NEVER PROMISE OR GUARANTEE ANYTHING - Only state facts from the information above. Don't make commitments about features, timelines, or capabilities not listed.

3. FAQ QUESTIONS - ALWAYS use openFaqItem tool FIRST when user asks about:
   - "what makes Omnia different" or "why Omnia" → openFaqItem faqId "1"
   - "latency" or "how fast" or "response time" → openFaqItem faqId "2"
   - "languages" or "which languages" or "how many languages" → openFaqItem faqId "3"
   - "deployment" or "self-host" or "on-premise" or "cloud" → openFaqItem faqId "4"
   - "compliance" or "security" or "GDPR" or "data" → openFaqItem faqId "5"
   - "batch" or "streaming" or "real-time" → openFaqItem faqId "6"
   Call the tool IMMEDIATELY, then give a brief verbal answer. No confirmation needed.

4. NAVIGATION - Only use scrollToSection when user EXPLICITLY says "show me", "go to", "take me to", or similar. Don't navigate just because they asked a question. This stays on the same page - no confirmation needed.

5. PLAYGROUND REQUESTS - If user wants to try the playground, voice agent demo, or transcription:
   - FIRST say: "Starting that will end our voice session. Would you like me to take you there?"
   - Only use switchPlaygroundTab or setTranscribeMode AFTER they confirm "yes"

6. EXTERNAL LINKS (DOCS/DASHBOARD/CONTACT) - These open in NEW TABS, so ask first:
   - If user wants to contact sales, see docs, or sign up, FIRST say: "That will open in a new tab. Would you like me to do that?"
   - Only use openContact, openDocs, or openDashboard AFTER they confirm "yes"

7. Keep responses SHORT - one or two sentences max. Be conversational and helpful.

8. LANGUAGE SWITCHING - If user asks to switch language or speaks in another language, say: "I'm optimized for English text-to-speech, but feel free to ask in your language and I'll respond in English."

9. CONTACT SALES - If user wants to talk to sales, get a demo, or be contacted:
   - Ask if they'd like you to open the contact page
   - Only use openContact AFTER they confirm

10. SPECIFIC DEPLOYMENT / REGION / COMPLIANCE QUESTIONS - You can describe our general deployment options (cloud, dedicated, self-hosted) and general compliance (EU data residency, encryption, self-host). But for a SPECIFIC commitment you can't confirm from the info above — a named region (e.g. "deployment in the US for HIPAA", "self-host in Frankfurt"), a specific certification (HIPAA, SOC 2, BAA, ISO 27001), or a binding guarantee — do NOT guess.

   THIS IS A STRICT TWO-STEP SEQUENCE. Never collapse it into one turn:
   - STEP 1 (ASK): Say "I can't confirm that specific one myself, but I can call a colleague on the team right now and get you the answer — would you like me to?" Then STOP and WAIT for their reply. Do NOT call askHuman in this turn. Do NOT call any tool yet.
   - STEP 2 (ONLY AFTER A CLEAR YES): If — and only if — they reply yes/sure/go ahead, say "Great, calling them now — one moment," then call askHuman with their exact question and userConfirmed=true.
   - If they say no, or anything other than a clear yes, do NOT call. Offer another way to help.
   - You must NEVER call askHuman unless the user agreed to the call in a PREVIOUS turn. Offering and calling in the same turn is forbidden.

   - While waiting, stay warm and on the line. When the answer comes back (a "[System: ...]" note), relay it naturally and in full.
   - If the answer asks you to follow up, collect the caller's PHONE NUMBER including COUNTRY CODE, read it back to confirm, then ask "anything else I can help with?" — don't end the call abruptly.`;

export async function POST() {
  try {
    const voiceApiKey = process.env.OMNIA_VOICE_API_KEY;

    if (!voiceApiKey) {
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 500 }
      );
    }

    // Create a WebSocket call for the landing page voice control demo using inline endpoint
    const response = await fetch('https://dashboard.omnia-voice.com/api/v1/calls/inline', {
      method: 'POST',
      headers: {
        'X-API-Key': voiceApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,
        voice: "4fed8c41-bb30-45d6-bf65-47aa0b326523",
        language: "en",
        greeting: "Hi, I'm Luna! I can answer questions and control this page with my voice. Try asking about pricing, or say 'show me the playground' and watch me navigate for you.",
        firstSpeaker: "agent",
        temperature: 0.3,
        maxDuration: 300,
        connectionType: 'websocket',
        websocket: {
          inputSampleRate: 16000,
          outputSampleRate: 16000,
          codec: 'pcm',
        },
        selectedTools: toolDefinitions,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Voice API error:', response.status, errorText);

      return NextResponse.json(
        { error: 'Failed to create demo call' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      callId: data.id,
      websocketUrl: data.websocketUrl,
    });
  } catch (error) {
    console.error('Landing demo call error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
