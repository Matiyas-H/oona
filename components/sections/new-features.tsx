"use client";

import { useState } from "react";
import Image from "next/image";
// import avatar1 from "@/assets/images/avatar-ashwin-santiago.jpg";
// import avatar2 from "@/assets/images/avatar-florence-shaw.jpg";
// import avatar3 from "@/assets/images/avatar-lula-meyers.jpg";
import { motion } from "framer-motion";
import { Ellipsis } from "lucide-react";

import Avatar from "@/components/Avatar";
import FeatureCard from "@/components/FeatureCard";
import Key from "@/components/Key";
import Tag from "@/components/Tag";

const features = [
  "PDF & URL Knowledge Bases",
  "Twilio, SIP & BYOT Support",
  "Outbound & Batch calls",
  "Instant Call Transfer with Context",
  "Automatic Call Summaries & recordings",
  "Live Call Monitoring Dashboard",
  "Embeddable Web Widget",
  "Adaptive Turn-Taking Engine",
];

const parentVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.7,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Features() {
  // Track which feature is expanded
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="container max-w-6xl">
        <div className="flex justify-center">
          <Tag>Features</Tag>
        </div>
        <h2 className="m-auto mt-6 max-w-2xl text-center font-heading text-4xl font-medium md:text-5xl">
          Where power meets <span className="text-purple-400">simplicity</span>
        </h2>
        <motion.div
          variants={parentVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mt-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <FeatureCard
                title="Instant, Natural Chats"
                description="Speak and hear back in under 250ms, so every interaction feels instant and human. No more awkward pauses—just natural, fluid dialogue."
                className="md:col-span-2 lg:col-span-1"
              >
                <div className="flex aspect-video items-center justify-center">
                  <p className="text-center text-4xl font-extrabold transition-all duration-500">
                    ⚡ Ultra {" "}
                    <span className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Low-Latency
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-400 transition-all duration-500 group-hover:w-full"></span>
                    </span>{" "}
                    Conversations
                  </p>
                </div>
                {/* <div className="flex aspect-video items-center justify-center">
                  <Avatar className="z-40">
                    <Image src="" alt="Avatar 1" className="rounded-full" />
                  </Avatar>
                  <Avatar className="z-30 -ml-6 border-indigo-500">
                    <Image src="" alt="Avatar 2" className="rounded-full" />
                  </Avatar>
                  <Avatar className="z-20 -ml-6 border-amber-500">
                    <Image src="" alt="Avatar 3" className="rounded-full" />
                  </Avatar>
                  <Avatar className="z-10 -ml-6 border-transparent">
                    <div className="flex size-full items-center justify-center rounded-full bg-neutral-700">
                      <Ellipsis size={30} />
                    </div>
                  </Avatar>
                </div> */}
              </FeatureCard>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <FeatureCard
                title="True Multilingual Understanding"
                description="Switch languages mid-call while holding your accent steady—no extra setup, no awkward transitions."
                className="group transition duration-500 md:col-span-2 lg:col-span-1"
              >
                <div className="flex aspect-video items-center justify-center">
                  <p className="text-center text-4xl font-extrabold transition-all duration-500">
                    🌎 Dynamic Language,{" "}
                    <span className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Static
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-400 transition-all duration-500 group-hover:w-full"></span>
                    </span>{" "}
                    Accent
                  </p>
                </div>
              </FeatureCard>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <FeatureCard
                title="Automate in Seconds—Zero Code"
                description="Connect to Twilio, Zapier, Make.com, n8n or your own webhooks with a few clicks. Trigger real-time workflows straight from the call."
                className="group transition duration-500 md:col-span-2 lg:col-span-1"
              >
                <div className="flex aspect-video items-center justify-center">
                  <p className="text-center text-4xl font-extrabold transition-all duration-500">
                    🔗 Plug-and-Play{" "}
                    <span className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Integrations
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-400 transition-all duration-500 group-hover:w-full"></span>
                    </span>{" "}
                    & Automation
                  </p>
                </div>
              </FeatureCard>
            </motion.div>

            {/* <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <FeatureCard
                title="Keyboard quick actions"
                description="Powerfull commands to make design quickly"
                className="group md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto"
              >
                <div className="flex aspect-video items-center justify-center gap-4">
                  <Key className="w-28 outline outline-2 outline-offset-2 outline-transparent transition-all duration-500 group-hover:translate-y-1 group-hover:outline-lime-400">
                    create
                  </Key>
                  <Key className="outline outline-2 outline-offset-2 outline-transparent transition-all delay-150 duration-500 group-hover:translate-y-1 group-hover:outline-lime-400">
                    test
                  </Key>
                  <Key className="outline outline-2 outline-offset-2 outline-transparent transition-all delay-300 duration-500 group-hover:translate-y-1 group-hover:outline-lime-400">
                    🚀
                  </Key>
                </div>
              </FeatureCard>
            </motion.div> */}
          </div>
        </motion.div>

        <div className="m-auto my-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, index) => {
            return (
              <div
                className="group relative flex items-center gap-3 rounded-2xl border border-black bg-white px-3 py-1.5 text-black transition-all duration-300 hover:bg-gray-50 md:px-5 md:py-2"
                key={feature}
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-400 text-xl text-white transition duration-500 hover:rotate-45">
                  &#10038;
                </span>
                <span className="truncate font-medium md:text-lg">
                  {feature}
                </span>

                {/* Show full text in tooltip on hover/focus */}
                <div
                  className={`pointer-events-none invisible absolute bottom-full left-0 mb-2 w-full opacity-0 transition-all duration-300 ${expandedIndex === index ? "visible opacity-100" : ""} group-hover:visible group-hover:opacity-100`}
                >
                  <div className="rounded-lg border border-black bg-white p-2 shadow-lg">
                    {feature}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
