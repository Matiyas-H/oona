"use client";

import { motion } from "framer-motion";
import { Cloud, Server, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

const deploymentOptions = [
  {
    id: "hosted",
    icon: Cloud,
    title: "Cloud",
    subtitle: "Fastest to production",
    description:
      "Fully managed infrastructure. GPU-optimized, auto-scaling, monitored 24/7. Start building in minutes.",
    features: ["Pay-per-minute", "Auto-scaling", "No ops required"],
    cta: "Start free",
    href: "https://dashboard.omnia-voice.com/login",
    highlighted: true,
  },
  {
    id: "dedicated",
    icon: Server,
    title: "Dedicated",
    subtitle: "Reserved capacity",
    description:
      "Private endpoints on Omnia-managed GPU clusters. Custom SLAs, predictable performance, compliance-ready.",
    features: ["Dedicated GPUs", "Custom SLAs", "Private endpoints"],
    cta: "Contact sales",
    href: "/contact",
    highlighted: false,
  },
  {
    id: "self-hosted",
    icon: Building2,
    title: "Self-Hosted",
    subtitle: "Full control",
    description:
      "Deploy on your infrastructure — cloud or on-premise. Same API, same performance, complete control.",
    features: ["Data sovereignty", "On-premise option", "Annual license"],
    cta: "Contact sales",
    href: "/contact",
    highlighted: false,
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

const DeploymentOptions = () => {
  return (
    <section className="bg-[#1a1a1a] py-24 md:py-32">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium tracking-wide text-white/40">
            DEPLOYMENT
          </span>
          <h2 className="mt-4 font-heading text-3xl text-white md:text-4xl lg:text-5xl">
            Run it your way
          </h2>
          <p className="mt-4 text-white/50 md:text-lg">
            Same API across all deployment options. Build once, move freely as
            your needs evolve.
          </p>
        </div>

        {/* Options grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 md:mt-20 md:grid-cols-3"
        >
          {deploymentOptions.map((option) => (
            <motion.div
              key={option.id}
              variants={itemVariants}
              className={`group flex flex-col border p-8 transition-all ${
                option.highlighted
                  ? "border-[#2D5A27]/50 bg-[#2D5A27]/[0.08]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              {/* Icon */}
              <div
                className={`mb-6 flex size-12 items-center justify-center border ${
                  option.highlighted
                    ? "border-[#2D5A27]/40 text-[#2D5A27]"
                    : "border-white/20 text-white/60"
                }`}
              >
                <option.icon className="size-5" />
              </div>

              {/* Title */}
              <div className="mb-1 flex items-center gap-3">
                <h3 className="font-heading text-2xl text-white">
                  {option.title}
                </h3>
                {option.highlighted && (
                  <span className="bg-[#2D5A27]/20 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#2D5A27]">
                    POPULAR
                  </span>
                )}
              </div>
              <p className="mb-4 text-sm text-white/40">{option.subtitle}</p>

              {/* Description */}
              <p className="mb-6 flex-1 text-sm leading-relaxed text-white/60">
                {option.description}
              </p>

              {/* Features */}
              <ul className="mb-8 space-y-2">
                {option.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-white/50"
                  >
                    <span
                      className={`size-1 ${option.highlighted ? "bg-[#2D5A27]" : "bg-white/30"}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={option.href}
                className={`inline-flex items-center justify-center gap-2 py-3 text-sm font-medium tracking-wide transition-all ${
                  option.highlighted
                    ? "bg-[#2D5A27] text-white hover:bg-[#2D5A27]/90"
                    : "border border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                }`}
              >
                {option.cta}
                <ArrowRight className="size-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <p className="mt-12 text-center text-sm text-white/30">
          All options include the same API surface, documentation, and support.
        </p>
      </div>
    </section>
  );
};

export { DeploymentOptions };
