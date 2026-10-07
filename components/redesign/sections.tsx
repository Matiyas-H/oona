"use client";

// Client module because the data below lives in the existing (client) section
// components; a server component importing it would get reference proxies.
import { useEffect, useState } from "react";
import Link from "next/link";

import { capabilities } from "@/components/sections/capabilities";
import { deploymentOptions } from "@/components/sections/deployment-options";
import { faqData } from "@/components/sections/faq-new";
import { plans } from "@/components/sections/pricing-section";

import { frame } from "./frame";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ov-accent)]";

export function SectionHead({
  title,
  intro,
  as: Heading = "h2",
  children,
}: {
  title: React.ReactNode;
  intro?: string;
  // h1 where the section opens its own page.
  as?: "h1" | "h2";
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-[color:var(--ov-line)] px-5 py-14 md:flex-row md:items-end md:justify-between md:px-12 md:py-20">
      <div>
        <Heading className="max-w-[20ch] font-heading text-[2.25rem] leading-[1.05] tracking-[-0.01em] md:text-[3.5rem]">
          {title}
        </Heading>
        {intro && (
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-[color:var(--ov-muted)]">
            {intro}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ----------------------------------------------------------- features ---- */

// id="features" is one of Luna's navigation targets.
export function Capabilities() {
  return (
    <section id="features" className="border-b border-[color:var(--ov-line)]">
      <div className={frame}>
        <SectionHead
          title="One foundation, two products."
          intro="Transcribe and Voice Agents share the same audio-native architecture. Here's what that gives you."
        />
        <ul className="grid gap-px bg-[color:var(--ov-line)] sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <li
              key={c.title}
              className="flex min-h-[220px] flex-col bg-[color:var(--ov-ground)] px-5 py-8 md:px-10"
            >
              <h3 className="font-heading text-2xl">{sentenceCase(c.title)}</h3>
              <p className="mt-3 max-w-[38ch] flex-1 leading-relaxed text-[color:var(--ov-muted)]">
                {c.description}
              </p>
              <p className="mt-6 flex gap-2 text-[13px]">
                {c.products.map((p) => (
                  <span
                    key={p}
                    className="border border-[color:var(--ov-accent-faint)] px-2 py-0.5 text-[color:var(--ov-accent)]"
                  >
                    {p}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// The source data is Title Case ("Batch & Streaming"); this page sets
// headings in sentence case.
function sentenceCase(s: string) {
  return s
    .replace(/&/g, "and")
    .split(" ")
    .map((w, i) =>
      i === 0 || /^[A-Z0-9]{2,}/.test(w) || w === "MoE" ? w : w.toLowerCase(),
    )
    .join(" ")
    .replace(/-([A-Z])(?=[a-z])/g, (_, c: string) => `-${c.toLowerCase()}`);
}

/* --------------------------------------------------------- deployment ---- */

export function Deployment() {
  return (
    <section id="deployment" className="border-b border-[color:var(--ov-line)]">
      <div className={frame}>
        <SectionHead
          title="Run it on our GPUs, or on yours."
          intro="Same API across all deployment options. Build once, move freely as your needs evolve."
        />
        <div className="grid md:grid-cols-3">
          {deploymentOptions.map((o, i) => (
            <div
              key={o.id}
              className={`flex flex-col px-5 py-10 md:px-10 ${
                i < deploymentOptions.length - 1
                  ? "max-md:border-b md:border-r"
                  : ""
              } border-[color:var(--ov-line)]`}
            >
              <h3 className="font-heading text-3xl">{sentenceCase(o.title)}</h3>
              <p className="mt-1 text-[color:var(--ov-accent)]">{o.subtitle}</p>
              <p className="mt-5 flex-1 leading-relaxed text-[color:var(--ov-muted)]">
                {o.description}
              </p>
              <ul className="mt-6 space-y-2 text-[15px]">
                {o.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span aria-hidden className="size-1.5 bg-[color:var(--ov-accent)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={o.href}
                className={`mt-8 inline-flex h-11 items-center justify-center px-6 text-[15px] transition-colors ${focusRing} ${
                  o.highlighted
                    ? "bg-[color:var(--ov-btn)] font-medium text-[color:var(--ov-btn-text)] hover:bg-[color:var(--ov-btn-hover)]"
                    : "border border-[color:var(--ov-line-strong)] hover:border-[color:var(--ov-line-stronger)] hover:bg-[color:var(--ov-hover)]"
                }`}
              >
                {o.cta}
              </Link>
            </div>
          ))}
        </div>
        {/* The shared layer all three sit on: a quiet footnote to the columns,
            not a banner. */}
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[color:var(--ov-line)] bg-[color:var(--ov-brand-tint)] px-5 py-4 text-[15px] md:px-10">
          <span aria-hidden className="size-1.5 bg-[color:var(--ov-accent)]" />
          <span className="text-[color:var(--ov-text)]">One API surface.</span>
          <span className="text-[color:var(--ov-muted)]">
            Move between them without changing code.
          </span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ pricing ---- */

type Period = "monthly" | "yearly";
const fmt = (v: number | string | null) =>
  v === null
    ? "—"
    : typeof v === "number"
      ? v.toLocaleString("en-US")
      : v === "unlimited"
        ? "Unlimited"
        : v;

const planColumns = [
  { key: "credits", label: "Credits / mo" },
  { key: "voiceMinutes", label: "Voice min" },
  { key: "sttMinutes", label: "STT min" },
  { key: "agents", label: "Agents" },
  { key: "concurrency", label: "Concurrency" },
  { key: "rollover", label: "Rollover" },
] as const;

// Same plan data as /pricing and Luna's script, so the three can't disagree.
export function Pricing({ as = "h2" }: { as?: "h1" | "h2" }) {
  const [period, setPeriod] = useState<Period>("monthly");

  const price = (p: (typeof plans)[number]) => {
    const v = period === "monthly" ? p.monthly : p.yearly;
    if (typeof v !== "number") return { amount: "Custom", unit: "" };
    return {
      amount: `$${v.toLocaleString("en-US")}`,
      unit: period === "monthly" ? "/mo" : "/yr",
    };
  };

  return (
    <section id="pricing" className="border-b border-[color:var(--ov-line)]">
      <div className={frame}>
        <SectionHead
          title="Simple, transparent pricing."
          intro="Start free, scale as you grow. All plans include the same API and features."
          as={as}
        >
          <div
            role="group"
            aria-label="Billing period"
            className="flex shrink-0 border border-[color:var(--ov-line-strong)]"
          >
            {(["monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                aria-pressed={period === p}
                className={`px-5 py-2.5 text-[15px] transition-colors ${focusRing} ${
                  period === p
                    ? "bg-[color:var(--ov-btn)] text-[color:var(--ov-btn-text)]"
                    : "text-[color:var(--ov-muted)] hover:text-[color:var(--ov-text)]"
                }`}
              >
                {p === "monthly" ? "Monthly" : "Yearly, save 17%"}
              </button>
            ))}
          </div>
        </SectionHead>

        {/* Desktop: full comparison table */}
        <div className="hidden lg:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[color:var(--ov-line)] text-[13px] text-[color:var(--ov-muted)]">
                <th className="py-4 pl-12 pr-4 font-normal">Plan</th>
                <th className="px-4 py-4 font-normal">Price</th>
                {planColumns.map((c) => (
                  <th key={c.key} className="px-4 py-4 font-normal">
                    {c.label}
                  </th>
                ))}
                <th className="pr-12" />
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => {
                const { amount, unit } = price(p);
                return (
                  <tr
                    key={p.name}
                    className={`border-b border-[color:var(--ov-line)] last:border-b-0 ${p.highlighted ? "bg-[color:var(--ov-brand-tint)]" : ""}`}
                  >
                    <td className="py-5 pl-12 pr-4">
                      <div className="flex items-center gap-2 font-heading text-lg">
                        {p.name}
                        {p.highlighted && (
                          <span className="bg-[color:var(--ov-accent)] px-1.5 py-0.5 text-[11px] text-[color:var(--ov-btn-text)] [font-family:var(--font-sans)]">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="text-[13px] text-[color:var(--ov-muted)]">
                        {p.description}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="font-heading text-2xl tabular-nums">
                        {amount}
                      </span>
                      <span className="text-sm text-[color:var(--ov-muted)]">{unit}</span>
                    </td>
                    {planColumns.map((c) => (
                      <td
                        key={c.key}
                        className="px-4 py-5 tabular-nums text-[color:var(--ov-text-soft)]"
                      >
                        {fmt(p[c.key])}
                      </td>
                    ))}
                    <td className="py-5 pl-4 pr-12 text-right">
                      <Link
                        href={p.href}
                        className={`inline-flex h-10 items-center whitespace-nowrap px-4 text-sm transition-colors ${focusRing} ${
                          p.highlighted
                            ? "bg-[color:var(--ov-btn)] font-medium text-[color:var(--ov-btn-text)] hover:bg-[color:var(--ov-btn-hover)]"
                            : "border border-[color:var(--ov-line-strong)] hover:border-[color:var(--ov-line-stronger)]"
                        }`}
                      >
                        {p.cta}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile and tablet: one cell per plan */}
        <ul className="grid gap-px bg-[color:var(--ov-line)] sm:grid-cols-2 lg:hidden">
          {plans.map((p) => {
            const { amount, unit } = price(p);
            return (
              <li
                key={p.name}
                className={`px-5 py-6 ${p.highlighted ? "bg-[color:var(--ov-brand-tint)]" : "bg-[color:var(--ov-ground)]"}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="font-heading text-xl">{p.name}</div>
                    <div className="text-[13px] text-[color:var(--ov-muted)]">
                      {p.description}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-heading text-2xl tabular-nums">
                      {amount}
                    </span>
                    <span className="text-sm text-[color:var(--ov-muted)]">{unit}</span>
                  </div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  {planColumns.map((c) => (
                    <div key={c.key} className="flex justify-between gap-2">
                      <dt className="text-[color:var(--ov-muted)]">{c.label}</dt>
                      <dd className="tabular-nums">{fmt(p[c.key])}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href={p.href}
                  className={`mt-5 flex h-10 items-center justify-center text-sm ${focusRing} ${
                    p.highlighted
                      ? "bg-[color:var(--ov-btn)] font-medium text-[color:var(--ov-btn-text)]"
                      : "border border-[color:var(--ov-line-strong)]"
                  }`}
                >
                  {p.cta}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="border-t border-[color:var(--ov-line)] px-5 py-5 text-sm text-[color:var(--ov-muted)] md:px-12">
          All plans include EU data residency, API access, and documentation.{" "}
          <Link
            href="/contact"
            className={`text-[color:var(--ov-accent)] underline underline-offset-4 ${focusRing}`}
          >
            Contact us
          </Link>{" "}
          for volume discounts.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- faq ---- */

type FaqItem = { id: string; question: string; answer: string };

export function Faq({
  items = faqData,
  title = "Common questions.",
  lunaControlled = true,
}: {
  items?: FaqItem[];
  title?: string;
  // The homepage FAQ is the one Luna opens answers in (see landing-voice-control).
  lunaControlled?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!lunaControlled) return;
    const onOpen = (e: Event) => {
      const { faqId } = (e as CustomEvent<{ faqId: string }>).detail;
      setOpenId(faqId);
      document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("openFaqItem", onOpen);
    return () => window.removeEventListener("openFaqItem", onOpen);
  }, [lunaControlled]);

  return (
    <section
      id={lunaControlled ? "faq" : undefined}
      className="border-b border-[color:var(--ov-line)]"
    >
      <div
        className={`${frame} grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`}
      >
        <div className="border-[color:var(--ov-line)] px-5 py-14 max-lg:border-b md:px-12 lg:border-r lg:py-20">
          <h2 className="font-heading text-[2.25rem] leading-[1.05] md:text-[3.5rem]">
            {title}
          </h2>
          <p className="mt-5 max-w-[34ch] text-lg leading-relaxed text-[color:var(--ov-muted)]">
            Something else on your mind?{" "}
            <Link
              href="/contact"
              className={`text-[color:var(--ov-accent)] underline underline-offset-4 ${focusRing}`}
            >
              Ask us directly
            </Link>
            , or ask Luna at the bottom of the page.
          </p>
        </div>
        <ul className="divide-y divide-[color:var(--ov-line)]">
          {items.map((f) => {
            const open = openId === f.id;
            return (
              <li key={f.id}>
                <h3>
                  <button
                    onClick={() => setOpenId(open ? null : f.id)}
                    aria-expanded={open}
                    aria-controls={`faq-${f.id}`}
                    className={`flex w-full items-center justify-between gap-6 px-5 py-6 text-left text-lg transition-colors hover:bg-[color:var(--ov-hover)] md:px-10 ${focusRing}`}
                  >
                    {f.question}
                    <span
                      aria-hidden
                      className={`grid size-6 shrink-0 place-items-center border leading-none transition-colors ${
                        open
                          ? "border-[color:var(--ov-accent)] bg-[color:var(--ov-accent)] text-[color:var(--ov-btn-text)]"
                          : "border-[color:var(--ov-line-strong)]"
                      }`}
                    >
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${f.id}`}
                  hidden={!open}
                  className="px-5 pb-7 md:px-10"
                >
                  <p className="max-w-[60ch] leading-relaxed text-[color:var(--ov-muted)]">
                    {f.answer}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
