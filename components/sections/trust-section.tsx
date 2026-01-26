"use client";

import { motion } from "framer-motion";
import { Shield, Building2, Clock, Server } from "lucide-react";

const trustPoints = [
  {
    icon: Building2,
    title: "EU Data Residency",
    description: "All data hosted in EU",
  },
  {
    icon: Server,
    title: "Self-Hosted Option",
    description: "Complete data sovereignty",
  },
];

const TrustSection = () => {
  return (
    <section className="border-y border-[#1a1a1a]/10 bg-white py-16 md:py-20">
      <div className="container max-w-6xl">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8">
          {/* Left text */}
          <div className="max-w-md text-center md:text-left">
            <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
              TRUSTED IN PRODUCTION
            </span>
            <h3 className="mt-3 font-heading text-2xl text-[#1a1a1a] md:text-3xl">
              Powering critical infrastructure
            </h3>
            <p className="mt-3 text-sm text-[#1a1a1a]/60">
              From healthcare to financial services, teams choose Omnia when
              accuracy and compliance aren't optional.
            </p>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            {trustPoints.map((point) => (
              <div
                key={point.title}
                className="flex flex-col items-center gap-2 border border-[#1a1a1a]/10 bg-[#FAFAF9] p-4 text-center md:px-6 md:py-5"
              >
                <point.icon className="size-5 text-[#2D5A27]" />
                <div className="text-sm font-medium text-[#1a1a1a]">
                  {point.title}
                </div>
                <div className="text-xs text-[#1a1a1a]/50">
                  {point.description}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { TrustSection };
