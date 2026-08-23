"use client";

import { motion } from "framer-motion";
import { FileAudio, AudioLines } from "lucide-react";

/**
 * The two-product split, lifted out of the hero and placed after the playground.
 *
 * In the hero it added 378px on top of an already tall block and pushed the
 * demo below two folds. It reads better here anyway: by this point someone has
 * heard an agent answer, so "there are two ways to use this" is an answer to a
 * question they now have, rather than a choice imposed before they know what
 * either thing sounds like.
 */
const ProductSplit = () => {
  return (
    <section className="border-t border-[#1a1a1a]/10 bg-[#FAFAF9] py-20 md:py-24">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
              TWO WAYS IN
            </span>
            <h2 className="mt-4 font-heading text-3xl text-[#1a1a1a] md:text-4xl">
              Take the whole stack, or just the part you need
            </h2>
          </div>

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
                Speech to text on its own. Batch a folder of recordings or stream
                live audio. Language is detected for you.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Batch", "Streaming", "50+ languages"].map((t) => (
                  <span
                    key={t}
                    className="border border-[#1a1a1a]/10 px-3 py-1 text-xs text-[#1a1a1a]/60"
                  >
                    {t}
                  </span>
                ))}
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
                The full stack. Audio goes straight to reasoning, so the agent
                can call your tools, read your documents, and hand off to a
                person when it should.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Real-time", "Tools & knowledge", "~250ms"].map((t) => (
                  <span
                    key={t}
                    className="border border-[#2D5A27]/20 bg-[#2D5A27]/5 px-3 py-1 text-xs text-[#2D5A27]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-[#1a1a1a]/40">
            Both audio-native. Same API. Your infrastructure or ours.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export { ProductSplit };
