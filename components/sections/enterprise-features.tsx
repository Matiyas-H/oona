"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Activity, Cpu, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    label: "COMPLIANCE",
    title: "Enterprise Governance",
    description:
      "Encryption at rest and in transit. Configurable retention policies. Full audit trails. Self-host for complete data sovereignty.",
    href: "/contact",
  },
  {
    icon: Activity,
    label: "OBSERVABILITY",
    title: "Deep Telemetry",
    description:
      "Per-call traces, latency breakdowns, and real-time alerting. Same visibility whether hosted or self-managed.",
    href: "/contact",
  },
  {
    icon: Cpu,
    label: "PERFORMANCE",
    title: "Dedicated Capacity",
    description:
      "Reserve GPU throughput on our infrastructure or deploy on your own fleet. Consistent performance under any load.",
    href: "/contact",
  },
  {
    icon: Users,
    label: "SUPPORT",
    title: "Partnership",
    description:
      "Work directly with Omnia engineering from proof-of-concept through production. Battle-tested runbooks included.",
    href: "/contact",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const EnterpriseFeatures = () => {
  return (
    <section className="border-y border-[#1a1a1a]/10 bg-white py-24 md:py-32">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
            ENTERPRISE
          </span>
          <h2 className="mt-4 font-heading text-3xl text-[#1a1a1a] md:text-4xl lg:text-5xl">
            Built for critical infrastructure
          </h2>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group border border-[#1a1a1a]/10 bg-[#FAFAF9] p-8 transition-all hover:border-[#1a1a1a]/20 md:p-10"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex size-12 items-center justify-center border border-[#1a1a1a]/10 text-[#1a1a1a]/60 transition-colors group-hover:border-[#2D5A27]/30 group-hover:text-[#2D5A27]">
                  <feature.icon className="size-5" />
                </div>
                <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
                  {feature.label}
                </span>
              </div>

              <Link href={feature.href}>
                <h3 className="font-heading text-2xl text-[#1a1a1a] transition-colors hover:text-[#2D5A27] md:text-3xl">
                  {feature.title}
                </h3>
              </Link>

              <p className="mt-4 leading-relaxed text-[#1a1a1a]/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export { EnterpriseFeatures };
