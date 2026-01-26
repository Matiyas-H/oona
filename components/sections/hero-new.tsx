"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileAudio, AudioLines } from "lucide-react";

const HeroNew = () => {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#FAFAF9] pb-16 pt-24 md:pb-24 md:pt-32">
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative max-w-7xl">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center md:mb-12"
        >
          <div className="inline-flex items-center gap-2 border border-[#1a1a1a]/10 bg-white px-4 py-2 text-xs font-medium tracking-wide text-[#1a1a1a]/70">
            <span className="size-1.5 rounded-full bg-[#2D5A27]" />
            AUDIO-NATIVE SPEECH MODELS
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto max-w-5xl text-center"
        >
          <h1 className="font-heading text-[2.75rem] leading-[1.1] tracking-tight text-[#1a1a1a] md:text-[4.5rem] lg:text-[5.5rem]">
            Accurate transcription.
            <br />
            <span className="text-[#2D5A27]">Intelligent conversation.</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-[#1a1a1a]/60 md:mt-8 md:text-xl"
        >
          Audio-native models for transcription and voice AI.
          50+ languages. Batch, streaming, or real-time conversations.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 md:mt-12 md:flex-row md:gap-6"
        >
          <Link
            href="https://dashboard.omnia-voice.com/login"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 bg-[#1a1a1a] px-8 text-sm font-medium tracking-wide text-white transition-all hover:bg-[#333] sm:w-auto"
          >
            START BUILDING
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex h-12 w-full items-center justify-center border border-[#1a1a1a]/20 bg-transparent px-8 text-sm font-medium tracking-wide text-[#1a1a1a] transition-all hover:border-[#1a1a1a]/40 hover:bg-[#1a1a1a]/5 sm:w-auto"
          >
            TALK TO SALES
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 text-center text-xs text-[#1a1a1a]/40 md:mt-14 md:flex md:max-w-xl md:items-center md:justify-center md:gap-8"
        >
          <span>From $0.05/min</span>
          <span className="hidden h-3 w-px bg-[#1a1a1a]/20 md:block" />
          <span>EU data residency</span>
          <span className="hidden h-3 w-px bg-[#1a1a1a]/20 md:block" />
          <span>Self-host available</span>
        </motion.div>

        {/* Two paths section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-20 max-w-5xl md:mt-28"
        >
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {/* Transcribe */}
            <div className="group relative border border-[#1a1a1a]/10 bg-white p-8 transition-all hover:border-[#1a1a1a]/20 md:p-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]">
                  <FileAudio className="size-5" />
                </div>
                <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
                  TRANSCRIBE
                </span>
              </div>

              <h3 className="font-heading text-2xl text-[#1a1a1a] md:text-3xl">
                Audio → Text
              </h3>

              <p className="mt-4 leading-relaxed text-[#1a1a1a]/60">
                High-accuracy STT optimized for English and Nordic languages.
                Batch files or stream in real-time. Auto-detects language.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="border border-[#1a1a1a]/10 px-3 py-1 text-xs text-[#1a1a1a]/60">
                  Batch
                </span>
                <span className="border border-[#1a1a1a]/10 px-3 py-1 text-xs text-[#1a1a1a]/60">
                  Streaming
                </span>
                <span className="border border-[#1a1a1a]/10 px-3 py-1 text-xs text-[#1a1a1a]/60">
                  50+ languages
                </span>
              </div>
            </div>

            {/* Voice Agents */}
            <div className="group relative border border-[#2D5A27]/30 bg-[#2D5A27]/[0.02] p-8 transition-all hover:border-[#2D5A27]/50 md:p-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center border border-[#2D5A27]/30 text-[#2D5A27]">
                  <AudioLines className="size-5" />
                </div>
                <span className="text-xs font-medium tracking-wide text-[#2D5A27]/60">
                  VOICE AGENTS
                </span>
              </div>

              <h3 className="font-heading text-2xl text-[#1a1a1a] md:text-3xl">
                Audio → Intelligence → Voice
              </h3>

              <p className="mt-4 leading-relaxed text-[#1a1a1a]/60">
                Full voice AI stack. Audio flows directly to reasoning —
                tools, knowledge bases, call routing. ~250ms response time.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="border border-[#2D5A27]/20 bg-[#2D5A27]/5 px-3 py-1 text-xs text-[#2D5A27]">
                  Real-time
                </span>
                <span className="border border-[#2D5A27]/20 bg-[#2D5A27]/5 px-3 py-1 text-xs text-[#2D5A27]">
                  Tools & knowledge
                </span>
                <span className="border border-[#2D5A27]/20 bg-[#2D5A27]/5 px-3 py-1 text-xs text-[#2D5A27]">
                  ~250ms latency
                </span>
              </div>
            </div>
          </div>

          {/* Tagline under cards */}
          <p className="mt-8 text-center text-sm text-[#1a1a1a]/40">
            Both audio-native. Same API. Your infrastructure or ours.
          </p>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20 border-t border-[#1a1a1a]/10 pt-12 md:mt-24 md:pt-16"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
            <div className="text-center">
              <div className="font-heading text-3xl text-[#1a1a1a] md:text-4xl">50+</div>
              <div className="mt-2 text-sm text-[#1a1a1a]/50">Languages</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl text-[#1a1a1a] md:text-4xl">~250ms</div>
              <div className="mt-2 text-sm text-[#1a1a1a]/50">First response</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl text-[#1a1a1a] md:text-4xl">Self-host</div>
              <div className="mt-2 text-sm text-[#1a1a1a]/50">Available</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-3xl text-[#1a1a1a] md:text-4xl">EU</div>
              <div className="mt-2 text-sm text-[#1a1a1a]/50">Data residency</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { HeroNew };
