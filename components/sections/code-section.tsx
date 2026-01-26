"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Copy, Check } from "lucide-react";

const codeExamples = [
  {
    id: "transcribe",
    label: "Transcribe",
    language: "bash",
    filename: "transcribe.sh",
    code: `curl -X POST https://stt.omnia-voice.com/transcribe \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: audio/mpeg" \\
  --data-binary @audio.mp3`,
  },
  {
    id: "stream",
    label: "Stream",
    language: "javascript",
    filename: "stream.js",
    code: `const ws = new WebSocket(
  "wss://stt.omnia-voice.com/stream?apiKey=YOUR_API_KEY"
);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "transcript") {
    console.log(data.transcript, data.isFinal);
  }
};

// Send PCM 16-bit audio at 16kHz
ws.send(audioChunk);`,
  },
  {
    id: "voice-agent",
    label: "Voice Agent",
    language: "javascript",
    filename: "agent.js",
    code: `import { OmniaSession } from '@omnia-voice/sdk';

const session = new OmniaSession({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.omnia-voice.com'
});

await session.joinCall({ agentId: 'YOUR_AGENT_ID' });

session.addEventListener('transcripts', () => {
  console.log(session.transcripts);
});`,
  },
];

const CodeSection = () => {
  const [activeTab, setActiveTab] = useState("transcribe");
  const [copied, setCopied] = useState(false);

  const activeExample = codeExamples.find((e) => e.id === activeTab);

  const handleCopy = () => {
    if (activeExample) {
      navigator.clipboard.writeText(activeExample.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
              DEVELOPER EXPERIENCE
            </span>
            <h2 className="mt-4 font-heading text-3xl text-[#1a1a1a] md:text-4xl lg:text-5xl">
              Simple API,
              <br />
              powerful results
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#1a1a1a]/60">
              Transcribe audio, stream in real-time, or build full voice agents.
              Same API whether you're on our cloud or self-hosted.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="https://stt.omnia-voice.com/docs"
                className="group inline-flex items-center gap-2 bg-[#1a1a1a] px-6 py-3 text-sm font-medium tracking-wide text-white transition-all hover:bg-[#333]"
              >
                Read the docs
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right code block */}
          <div className="flex flex-col">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-[#1a1a1a]/10">
              {codeExamples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => setActiveTab(example.id)}
                  className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === example.id
                      ? "text-[#1a1a1a]"
                      : "text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60"
                  }`}
                >
                  {example.label}
                  {activeTab === example.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-x-0 -bottom-px h-px bg-[#1a1a1a]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Code area */}
            <div className="relative flex-1 bg-[#0d0d0d] p-6">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-white/40">
                  {activeExample?.filename}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/60"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Code */}
              <pre className="overflow-x-auto text-xs sm:text-sm">
                <code className="font-mono leading-relaxed text-white/80">
                  {activeExample?.code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CodeSection };
