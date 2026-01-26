"use client";

import { motion } from "framer-motion";
import { Globe, Layers, Radio, Lock, Cpu, Clock } from "lucide-react";

const capabilities = [
  {
    icon: Globe,
    title: "50+ Languages",
    description:
      "Optimized for English and Nordic languages. Strong across all supported languages. No language parameter required.",
    products: ["Transcribe", "Voice Agents"],
  },
  {
    icon: Radio,
    title: "Batch & Streaming",
    description:
      "Process recordings in bulk or transcribe live audio in real-time. Same API, same accuracy.",
    products: ["Transcribe"],
  },
  {
    icon: Clock,
    title: "~250ms Response",
    description:
      "Audio-native processing starts while users speak. No transcription bottleneck means faster time-to-response.",
    products: ["Voice Agents"],
  },
  {
    icon: Layers,
    title: "Dense & MoE",
    description:
      "Choose the architecture that fits your workload. Dense models for consistency, MoE for efficiency at scale.",
    products: ["Transcribe", "Voice Agents"],
  },
  {
    icon: Lock,
    title: "Regulated-Ready",
    description:
      "Built for critical infrastructure. End-to-end encryption. Self-host option for complete data sovereignty.",
    products: ["Transcribe", "Voice Agents"],
  },
  {
    icon: Cpu,
    title: "Your Infrastructure",
    description:
      "Run on our cloud, your cloud, or on-premise. Same API surface everywhere. Move between options as needs change.",
    products: ["Transcribe", "Voice Agents"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Capabilities = () => {
  return (
    <section className="bg-[#FAFAF9] py-24 md:py-32">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
            CAPABILITIES
          </span>
          <h2 className="mt-4 font-heading text-3xl text-[#1a1a1a] md:text-4xl lg:text-5xl">
            One foundation, two products
          </h2>
          <p className="mt-4 text-[#1a1a1a]/60 md:text-lg">
            Both Transcribe and Voice Agents share the same audio-native
            architecture. Here's what that enables.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-3"
        >
          {capabilities.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="group flex flex-col border border-[#1a1a1a]/10 bg-white p-8 transition-all hover:border-[#1a1a1a]/20"
            >
              <div className="mb-5 flex size-12 items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/70 transition-colors group-hover:border-[#2D5A27]/30 group-hover:text-[#2D5A27]">
                <item.icon className="size-5" />
              </div>

              <h3 className="font-heading text-xl text-[#1a1a1a]">
                {item.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#1a1a1a]/60">
                {item.description}
              </p>

              <div className="mt-4 flex gap-2">
                {item.products.map((product) => (
                  <span
                    key={product}
                    className="text-xs text-[#1a1a1a]/40"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export { Capabilities };
