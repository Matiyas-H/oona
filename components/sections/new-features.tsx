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
          {/* <Tag>Features</Tag> */}
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
                title="Turn-taking in ~250 ms"
                description="Our audio-native pipeline keeps first-token response times around a quarter second, so conversations stay human even under load."
                className="md:col-span-2 lg:col-span-1"
              >
                <div className="flex aspect-video items-center justify-center">
                  <p className="text-center text-4xl font-extrabold transition-all duration-500">
                    ⚡ {" "}
                    <span className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ~250 ms Turn-Taking
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
                title="Multilingual Streaming, One Stack"
                description="Switch languages or dialects mid-call while the pipeline keeps voices consistent—no extra setup, no failover."
                className="group transition duration-500 md:col-span-2 lg:col-span-1"
              >
                <div className="flex aspect-video items-center justify-center">
                  <p className="text-center text-4xl font-extrabold transition-all duration-500">
                    🌎 Multilingual{" "}
                    <span className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Streaming
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-400 transition-all duration-500 group-hover:w-full"></span>
                    </span>{" "}
                    Engine
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
                title="Programmable Routing & Automation"
                description="One routing layer drives Twilio, SIP trunks, and your own services in real time—no brittle middleware."
                className="group transition duration-500 md:col-span-2 lg:col-span-1"
              >
                <div className="flex aspect-video items-center justify-center">
                  <p className="text-center text-4xl font-extrabold transition-all duration-500">
                    🔗 Programmable{" "}
                    <span className="relative bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Routing
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

      </div>
    </section>
  );
}
