"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqData = [
  {
    id: "1",
    question: "What makes Omnia different from traditional STT services?",
    answer:
      "We encode audio directly into embeddings that language models understand natively. There's no separate transcription step, which eliminates STT errors and cuts latency significantly. You get the accuracy of transcription with the intelligence of a reasoning layer — or use standalone STT if that's all you need.",
  },
  {
    id: "2",
    question: "What latency should we expect?",
    answer:
      "Hosted Omnia Voice delivers ~250ms first-token response, with processing starting while the caller is still speaking. Dedicated and self-hosted deployments maintain the same performance profile — we help you size hardware to match.",
  },
  {
    id: "3",
    question: "Which languages do you support?",
    answer:
      "50+ languages with particular strength in English and Nordic languages. The system auto-detects language — no need to specify a language parameter. Mid-conversation language switching is handled seamlessly.",
  },
  {
    id: "4",
    question: "Can we move between deployment options?",
    answer:
      "Yes. The API surface is identical across cloud, dedicated, and self-hosted. Most customers start on our cloud platform, then graduate to dedicated or self-hosted as compliance or scale requirements evolve. No code changes required.",
  },
  {
    id: "5",
    question: "What about compliance and data sovereignty?",
    answer:
      "All data is hosted in the EU with encryption in transit and at rest. Self-hosted customers keep all audio and metadata inside their own environment. We already serve regulated enterprises across healthcare, finance, and government.",
  },
  {
    id: "6",
    question: "Do you support batch processing?",
    answer:
      "Yes. Both streaming (real-time) and batch processing are supported through the same API. Use streaming for live conversations, batch for processing recordings at scale.",
  },
];

const FAQNew = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="bg-[#FAFAF9] py-24 md:py-32">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
            FAQ
          </span>
          <h2 className="mt-4 font-heading text-3xl text-[#1a1a1a] md:text-4xl">
            Common questions
          </h2>
        </div>

        {/* FAQ items */}
        <div className="space-y-0">
          {faqData.map((item, index) => (
            <div
              key={item.id}
              className={`border-t border-[#1a1a1a]/10 ${index === faqData.length - 1 ? "border-b" : ""}`}
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="flex w-full items-start justify-between gap-4 py-6 text-left transition-colors hover:text-[#2D5A27]"
              >
                <span className="font-heading text-lg text-[#1a1a1a]">
                  {item.question}
                </span>
                <span className="mt-1 shrink-0 text-[#1a1a1a]/40">
                  {openId === item.id ? (
                    <Minus className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-12 text-[#1a1a1a]/60">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#1a1a1a]/50">
            Have a different question?{" "}
            <a
              href="/contact"
              className="text-[#1a1a1a] underline underline-offset-4 transition-colors hover:text-[#2D5A27]"
            >
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export { FAQNew };
