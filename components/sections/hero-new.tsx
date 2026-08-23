"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * The hero deliberately carries one job: say what this is, and get people to
 * the demo.
 *
 * It used to carry three — the pitch, a two-product split, and a stat block —
 * which made it 1,475px tall against an 829px viewport. That pushed the
 * playground to 1,539px, so "Try it yourself" sat below two folds. Both of the
 * customers we have on record converted by *trying it*, so burying the demo
 * behind 750px of feature summary was working against the one thing that
 * reliably converts.
 *
 * The product cards now live in <ProductSplit /> below the playground. The old
 * four-stat block is gone: it repeated the trust strip 600px above it.
 */
const HeroNew = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#FAFAF9] pb-16 pt-24 md:pb-20 md:pt-32"
    >
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
          className="mb-8 flex justify-center md:mb-10"
        >
          <div className="inline-flex items-center gap-2 border border-[#1a1a1a]/10 bg-white px-4 py-2 text-xs font-medium tracking-wide text-[#1a1a1a]/70">
            <span className="size-1.5 rounded-full bg-[#2D5A27]" />
            AUDIO-NATIVE SPEECH MODELS
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="font-heading text-[2.75rem] leading-[1.1] tracking-tight text-[#1a1a1a] md:text-[4.25rem] lg:text-[5rem]">
            Voice AI, built to be
            <br />
            <span className="text-[#2D5A27]">depended on.</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-[#1a1a1a]/60 md:mt-8 md:text-xl"
        >
          Agents that answer the phone in 50+ languages, call your systems
          mid-conversation, and run wherever you need them to — our cloud, yours,
          or on-premise.
        </motion.p>

        {/* CTAs. Deliberately NOT "try it": the playground sits at the fold
            with its own "Try it yourself" heading, so a button that scrolls
            800px is a non-action and repeats itself within one screen. These
            serve the reader who does not need convincing — either they are
            ready to build, or they want the reference. The demo converts
            everyone else by simply being there. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 md:mt-12 md:flex-row md:gap-6"
        >
          <Link
            href="https://dashboard.omnia-voice.com/register"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 bg-[#1a1a1a] px-8 text-sm font-medium tracking-wide text-white transition-all hover:bg-[#333] sm:w-auto"
          >
            START BUILDING
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="https://guide.omnia-voice.com"
            className="inline-flex h-12 w-full items-center justify-center border border-[#1a1a1a]/20 bg-transparent px-8 text-sm font-medium tracking-wide text-[#1a1a1a] transition-all hover:border-[#1a1a1a]/40 hover:bg-[#1a1a1a]/5 sm:w-auto"
          >
            READ THE DOCS
          </Link>
        </motion.div>

        {/* Trust strip. Price deliberately dropped — leading with $0.08/min
            invites comparison shopping before anyone knows what this does. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 text-center text-xs text-[#1a1a1a]/40 md:mt-12 md:flex md:max-w-xl md:items-center md:justify-center md:gap-8"
        >
          <span>~250ms response</span>
          <span className="hidden h-3 w-px bg-[#1a1a1a]/20 md:block" />
          <span>50+ languages</span>
          <span className="hidden h-3 w-px bg-[#1a1a1a]/20 md:block" />
          <span>EU or self-hosted</span>
        </motion.div>
      </div>
    </section>
  );
};

export { HeroNew };
