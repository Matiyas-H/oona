"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const IntroNew = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#1a1a1a] py-32 md:py-48"
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container max-w-5xl">
        <motion.div style={{ opacity, y }} className="text-center">
          {/* The statement */}
          <h2 className="font-heading text-3xl leading-[1.2] text-white md:text-5xl lg:text-6xl">
            Traditional voice AI loses context
            <br />
            <span className="text-white/40">at every handoff.</span>
          </h2>

          <div className="mx-auto my-16 h-px w-24 bg-white/20" />

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/60 md:text-xl">
            Audio to text. Text to model. Model to response. Each step adds
            latency, drops nuance, and introduces errors. We built something
            different.
          </p>

          {/* Visual representation */}
          <div className="mt-20 grid gap-6 md:mt-24 md:grid-cols-2 md:gap-8">
            {/* Traditional approach */}
            <div className="border border-white/10 bg-white/[0.02] p-8 text-left md:p-10">
              <div className="mb-6 text-xs font-medium tracking-wide text-white/30">
                TRADITIONAL PIPELINE
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center border border-white/20 text-xs text-white/60">
                    1
                  </div>
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-sm text-white/40">Audio → STT</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center border border-white/20 text-xs text-white/60">
                    2
                  </div>
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-sm text-white/40">Text → LLM</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center border border-white/20 text-xs text-white/60">
                    3
                  </div>
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-sm text-white/40">Response → TTS</span>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="font-heading text-2xl text-white/30">
                  500-1000ms
                </div>
                <div className="mt-1 text-xs text-white/20">
                  Typical first response
                </div>
              </div>
            </div>

            {/* Omnia approach */}
            <div className="border border-[#2D5A27]/40 bg-[#2D5A27]/[0.05] p-8 text-left md:p-10">
              <div className="mb-6 text-xs font-medium tracking-wide text-[#2D5A27]">
                OMNIA VOICE
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center border border-[#2D5A27]/40 text-xs text-[#2D5A27]">
                    1
                  </div>
                  <div className="h-px flex-1 bg-[#2D5A27]/20" />
                  <span className="text-sm text-white/70">
                    Audio → Embeddings
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center border border-[#2D5A27]/40 text-xs text-[#2D5A27]">
                    2
                  </div>
                  <div className="h-px flex-1 bg-[#2D5A27]/20" />
                  <span className="text-sm text-white/70">
                    Direct to reasoning
                  </span>
                </div>
              </div>

              <div className="mt-8 border-t border-[#2D5A27]/20 pt-6">
                <div className="font-heading text-2xl text-[#2D5A27]">
                  ~250ms
                </div>
                <div className="mt-1 text-xs text-white/40">
                  Time to first response
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { IntroNew };
