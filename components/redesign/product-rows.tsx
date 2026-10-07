"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { codeExamples } from "@/components/sections/code-section";

const rows = [
  { id: "transcribe", index: "Transcribe" },
  { id: "agents", index: "Voice agents" },
  { id: "code", index: "API" },
] as const;

type RowId = (typeof rows)[number]["id"];

export function ProductRows() {
  const [active, setActive] = useState<RowId>("transcribe");

  // Highlight whichever row crosses the upper third of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as RowId);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    rows.forEach((r) => {
      const el = document.getElementById(r.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-b border-[color:var(--ov-line)]">
      <div className="mx-auto max-w-[1280px] border-x border-[color:var(--ov-line)]">
        <h2 className="border-b border-[color:var(--ov-line)] px-5 py-14 font-heading text-[2.25rem] leading-[1.05] tracking-[-0.01em] md:px-12 md:py-20 md:text-[3.5rem]">
          One audio-native model.
          <br />
          Take all of it, or just the part you need.
        </h2>

        <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)]">
          <nav
            aria-label="Products"
            className="hidden border-r border-[color:var(--ov-line)] md:block"
          >
            <ul className="sticky top-14 py-6">
              {rows.map((r) => (
                <li key={r.id}>
                  <a
                    href={`#${r.id}`}
                    aria-current={active === r.id ? "true" : undefined}
                    className={`flex items-center gap-3 px-6 py-2.5 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ov-accent)] ${
                      active === r.id
                        ? "text-[color:var(--ov-text)]"
                        : "text-[color:var(--ov-muted)] hover:text-[color:var(--ov-text)]"
                    }`}
                  >
                    <span
                      className={`size-2 transition-colors ${
                        active === r.id ? "bg-[color:var(--ov-accent)]" : "bg-[color:var(--ov-line-strong)]"
                      }`}
                    />
                    {r.index}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="divide-y divide-[color:var(--ov-line)]">
            <Row
              id="transcribe"
              title="You talk. We write down every word."
              body="Batch a folder of recordings or stream live audio as it happens. The language is detected for you, even when a speaker switches mid-conversation."
              link={{
                label: "Transcription docs",
                href: "https://guide.omnia-voice.com",
              }}
              field="green"
            >
              <TranscriptVisual />
            </Row>
            <Row
              id="agents"
              title="We answer the phone. You decide what happens next."
              body="Audio goes straight to reasoning, so the agent starts answering in about 250ms. It can call your tools, read your documents, and hand off to a person when it should."
              link={{
                label: "Build an agent",
                href: "https://guide.omnia-voice.com",
              }}
              field="sage"
            >
              <CallVisual />
            </Row>
            <Row
              id="code"
              title="We keep the API small. You build the rest."
              body="One endpoint for files, one WebSocket for live audio, one SDK for agents. The same calls work on every deployment."
              link={{
                label: "API reference",
                href: "https://guide.omnia-voice.com",
              }}
              field="green"
            >
              <CodeVisual />
            </Row>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  id,
  title,
  body,
  link,
  field,
  children,
}: {
  id: RowId;
  title: string;
  body: string;
  link: { label: string; href: string };
  field: "green" | "sage";
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className="grid scroll-mt-14 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <div className="flex flex-col justify-between gap-8 px-5 py-10 md:px-10 md:py-12">
        <div>
          <h3 className="max-w-[16ch] font-heading text-[1.75rem] leading-[1.1] md:text-[2.25rem]">
            {title}
          </h3>
          <p className="mt-5 max-w-[42ch] leading-relaxed text-[color:var(--ov-muted)]">
            {body}
          </p>
        </div>
        <Link
          href={link.href}
          className="self-start border-b border-[color:var(--ov-accent-line)] pb-0.5 text-[15px] text-[color:var(--ov-accent)] transition-colors hover:border-[color:var(--ov-accent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ov-accent)]"
        >
          {link.label}
        </Link>
      </div>
      <div
        className={`flex min-h-[340px] items-center justify-center p-6 md:p-10 lg:border-l lg:border-[color:var(--ov-line)] ${
          field === "green" ? "bg-[color:var(--ov-field)]" : "bg-[color:var(--ov-field-alt)]"
        }`}
      >
        <div className="w-full max-w-[520px] ov-panel border border-black/30 bg-[color:var(--ov-ground)] shadow-[8px_8px_0_rgba(0,0,0,0.25)]">
          {children}
        </div>
      </div>
    </article>
  );
}

function PanelHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-[color:var(--ov-line)] px-4 py-2.5 text-[13px] text-[color:var(--ov-muted)]">
      {children}
    </div>
  );
}

const transcript = [
  { t: "00:02", lang: "fi", text: "Hei, soitan tilauksesta numero 4471." },
  { t: "00:06", lang: "en", text: "I'd like to move the delivery to Friday." },
  { t: "00:10", lang: "sv", text: "Kan ni ringa mig tillbaka i eftermiddag?" },
];

function TranscriptVisual() {
  return (
    <>
      <PanelHeader>
        <span>support-call-0412.mp3</span>
        <span>Example</span>
      </PanelHeader>
      <ol className="divide-y divide-[color:var(--ov-line)]">
        {transcript.map((line) => (
          <li
            key={line.t}
            className="grid grid-cols-[3rem_2rem_1fr] gap-3 px-4 py-3.5 text-[15px]"
          >
            <span className="tabular-nums text-[color:var(--ov-muted)]">{line.t}</span>
            <span className="text-[color:var(--ov-accent)]">{line.lang}</span>
            <span>{line.text}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

function CallVisual() {
  return (
    <>
      <PanelHeader>
        <span>Inbound call</span>
        <span>Example</span>
      </PanelHeader>
      <div className="space-y-3 p-4 text-[15px]">
        <p className="text-[color:var(--ov-muted)]">
          <span className="text-[color:var(--ov-text)]">Caller</span> Where&apos;s my order?
          It was due yesterday.
        </p>
        <div className="border border-[color:var(--ov-line)] bg-[color:var(--ov-hover)] px-3 py-2 font-mono text-[13px] text-[color:var(--ov-accent)]">
          lookup_order(&quot;4471&quot;)
        </div>
        <p className="text-[color:var(--ov-muted)]">
          <span className="text-[color:var(--ov-text)]">Agent</span> It left the warehouse
          this morning and arrives Friday. Want a text when it&apos;s out for
          delivery?
        </p>
        <p className="border-t border-[color:var(--ov-line)] pt-3 text-[13px] text-[color:var(--ov-muted)]">
          Hands off to a person if the caller asks for one.
        </p>
      </div>
    </>
  );
}

function CodeVisual() {
  const [tab, setTab] = useState(codeExamples[0].id);
  const example = codeExamples.find((e) => e.id === tab) ?? codeExamples[0];

  return (
    <>
      <div role="tablist" className="flex border-b border-[color:var(--ov-line)]">
        {codeExamples.map((e) => (
          <button
            key={e.id}
            role="tab"
            aria-selected={tab === e.id}
            onClick={() => setTab(e.id)}
            className={`border-r border-[color:var(--ov-line)] px-4 py-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[color:var(--ov-accent)] ${
              tab === e.id
                ? "bg-[color:var(--ov-hover)] text-[color:var(--ov-text)]"
                : "text-[color:var(--ov-muted)] hover:text-[color:var(--ov-text)]"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>
      <pre className="h-[240px] overflow-auto p-4 text-[13px] leading-relaxed text-[color:var(--ov-text-soft)]">
        <code className="font-mono">{example.code}</code>
      </pre>
    </>
  );
}
