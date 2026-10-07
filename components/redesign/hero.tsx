import Link from "next/link";

import { waveLevels as levels } from "./waveform";

const waveCss = `
@keyframes ov-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
.ov-bar { transform-origin: bottom; animation: ov-rise 700ms cubic-bezier(.2,.7,.2,1) both; }
@media (prefers-reduced-motion: reduce) { .ov-bar { animation: none; } }
`;

export function Hero() {
  return (
    <section id="hero" className="border-b border-[color:var(--ov-line)]">
      <style>{waveCss}</style>
      <div className="mx-auto max-w-[1280px] border-x border-[color:var(--ov-line)]">
        <div className="px-5 pb-16 pt-20 md:px-12 md:pb-24 md:pt-28">
          <h1 className="max-w-[16ch] font-heading text-[3.25rem] leading-[0.95] tracking-[-0.02em] md:text-[6.5rem]">
            Voice AI, built <br className="hidden md:block" />
            to be depended on.
          </h1>
          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[minmax(0,34rem)_auto] md:items-end md:justify-between">
            <p className="text-lg leading-relaxed text-[color:var(--ov-muted)] md:text-xl">
              Agents that answer the phone in 50+ languages, call your systems
              mid-conversation, and run wherever you need them to: our cloud,
              yours, or on-premise.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://dashboard.omnia-voice.com/register"
                className="inline-flex h-12 items-center justify-center bg-[color:var(--ov-btn)] px-7 text-[15px] font-medium text-[color:var(--ov-btn-text)] transition-colors hover:bg-[color:var(--ov-btn-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ov-accent)]"
              >
                Start building
              </Link>
              <Link
                href="https://guide.omnia-voice.com"
                className="inline-flex h-12 items-center justify-center border border-[color:var(--ov-line-strong)] px-7 text-[15px] text-[color:var(--ov-text)] transition-colors hover:border-[color:var(--ov-line-stronger)] hover:bg-[color:var(--ov-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ov-accent)]"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </div>

        {/* The waveform: one block of cells per column, peak cell in sage.
            Odd columns drop out on small screens so cells stay square-ish. */}
        <div
          aria-hidden
          className="grid grid-cols-[repeat(32,minmax(0,1fr))] items-end gap-px border-t border-[color:var(--ov-line)] px-px pt-6 md:grid-cols-[repeat(64,minmax(0,1fr))]"
        >
          {levels.map((level, i) => (
            <div
              key={i}
              className={`ov-bar flex flex-col-reverse gap-px ${i % 2 ? "max-md:hidden" : ""}`}
              style={{ animationDelay: `${i * 14}ms` }}
            >
              {Array.from({ length: level }, (_, j) => (
                <span
                  key={j}
                  className={`aspect-square w-full ${
                    j === level - 1 && level > 2
                      ? "bg-[color:var(--ov-wave-peak)]"
                      : "bg-[color:var(--ov-wave)]"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
