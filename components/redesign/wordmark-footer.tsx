"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { footerLinks } from "@/config/site";

import { toPreview } from "./preview-links";
import { WAVE_ROWS, waveLevels } from "./waveform";

const comparisons = [
  { title: "Vapi", href: "/vapi-alternative" },
  { title: "Retell", href: "/retell-alternative" },
  { title: "Bland", href: "/bland-alternative" },
  { title: "ElevenLabs", href: "/elevenlabs-alternative" },
  { title: "Deepgram", href: "/deepgram-alternative" },
  { title: "OpenAI Realtime", href: "/openai-realtime-alternative" },
];

const columns = [
  ...footerLinks.map((s) => ({ title: s.title, items: s.items ?? [] })),
  { title: "Compare", items: comparisons },
];

// Wordmark geometry, in SVG user units. Cells are 10 units with a 2-unit gap;
// each waveform bar is two cells wide. Wide screens set the name on one line;
// phones stack it so it stays big.
const CELL = 10;
const layouts = {
  wide: { w: 1280, h: 230, lines: [{ text: "Omnia Voice", y: 208 }] },
  stacked: {
    w: 640,
    h: 450,
    lines: [
      { text: "Omnia", y: 205 },
      { text: "Voice", y: 428 },
    ],
  },
};
type Layout = keyof typeof layouts;

function barsFor({ w, h }: { w: number; h: number }) {
  const bar = 2 * CELL;
  const count = w / bar;
  return Array.from({ length: count }, (_, i) => {
    const level = waveLevels[Math.floor((i * waveLevels.length) / count)];
    // One row of headroom so the quiet stretches still light the letters'
    // lower halves.
    const height =
      Math.round((h * (level + 1)) / (WAVE_ROWS + 1) / CELL) * CELL;
    return { x: i * bar, y: h - height, width: bar, height };
  });
}

const meterCss = `
.ov-meter rect { transform-box: fill-box; transform-origin: bottom; transition: transform 900ms cubic-bezier(.2,.7,.2,1); }
.ov-armed .ov-meter rect { transform: scaleY(0); }
.ov-armed.ov-on .ov-meter rect { transform: scaleY(1); }
@media (prefers-reduced-motion: reduce) {
  .ov-meter rect { transition: none; }
  .ov-armed .ov-meter rect { transform: none; }
}
`;

/**
 * The page closes on the name, drawn in the same cells as the hero waveform.
 * The letters sit dim ("silence") and light up like a level meter when they
 * scroll into view ("speech"), using the hero's own bar heights.
 */
function Wordmark({
  layout,
  className,
}: {
  layout: Layout;
  className?: string;
}) {
  const { w: W, h: H, lines } = layouts[layout];
  const bars = barsFor(layouts[layout]);
  const id = (name: string) => `ov-${layout}-${name}`;
  const ref = useRef<HTMLDivElement>(null);
  // "armed" only once JS runs, so without it the wordmark renders fully lit.
  const [armed, setArmed] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    setArmed(true);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const text = (fill: string, clip?: string) =>
    lines.map((line) => (
      <text
        key={line.text}
        x={W / 2}
        y={line.y}
        textAnchor="middle"
        textLength={W - 24}
        lengthAdjust="spacingAndGlyphs"
        fontSize={250}
        fill={fill}
        clipPath={clip}
        style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
      >
        {line.text}
      </text>
    ));

  return (
    <div
      ref={ref}
      className={`${armed ? "ov-armed" : ""} ${on ? "ov-on" : ""} ${className ?? ""}`}
    >
      <style>{meterCss}</style>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Omnia Voice"
        className="block h-auto w-full"
      >
        <defs>
          {[
            ["dim", "var(--ov-mark-dim)"],
            ["lit", "var(--ov-mark-lit)"],
          ].map(([name, color]) => (
            <pattern
              key={name}
              id={id(name)}
              width={CELL}
              height={CELL}
              patternUnits="userSpaceOnUse"
            >
              <rect width={CELL - 2} height={CELL - 2} style={{ fill: color }} />
            </pattern>
          ))}
          <clipPath id={id("meter")} className="ov-meter">
            {bars.map((b, i) => (
              <rect
                key={i}
                x={b.x}
                y={b.y}
                width={b.width}
                height={b.height}
                style={{ transitionDelay: `${i * 12}ms` }}
              />
            ))}
          </clipPath>
        </defs>
        {text(`url(#${id("dim")})`)}
        {text(`url(#${id("lit")})`, `url(#${id("meter")})`)}
      </svg>
    </div>
  );
}

const linkClass =
  "text-[15px] text-[color:var(--ov-muted)] transition-colors hover:text-[color:var(--ov-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ov-accent)]";

export function WordmarkFooter() {
  return (
    <footer className="mx-auto max-w-[1280px] border-x border-[color:var(--ov-line)]">
      <div className="grid grid-cols-2 gap-px bg-[color:var(--ov-line)] md:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title} className="bg-[color:var(--ov-ground)] px-5 py-10 md:px-10">
            <h2 className="text-[15px] text-[color:var(--ov-text)]">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link href={toPreview(item.href)} className={linkClass}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 border-y border-[color:var(--ov-line)] px-5 py-10 md:flex-row md:items-end md:justify-between md:px-10">
        <p className="font-heading text-3xl md:text-4xl">
          Where silence meets speech.
        </p>
        <div className="text-sm leading-relaxed text-[color:var(--ov-muted)] md:text-right">
          <p className="text-[color:var(--ov-text)]">Omnia Voice Oy</p>
          <p>Business ID 3468022-7</p>
          <p>Helsinki, Finland</p>
        </div>
      </div>

      <div className="px-3 pb-3 pt-10 md:pt-14">
        <Wordmark layout="wide" className="max-sm:hidden" />
        <Wordmark layout="stacked" className="sm:hidden" />
      </div>

      <div className="flex flex-wrap justify-between gap-4 border-t border-[color:var(--ov-line)] px-5 py-5 text-[13px] text-[color:var(--ov-muted)] md:px-10">
        <span>© {new Date().getFullYear()} Omnia Voice Oy</span>
        <Link href="/cookies" className={linkClass}>
          Cookie settings
        </Link>
      </div>
    </footer>
  );
}
