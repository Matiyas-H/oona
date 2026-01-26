"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ArrowRight, Infinity } from "lucide-react";

type BillingPeriod = "monthly" | "yearly";

const plans = [
  {
    name: "Free",
    description: "Try it out",
    monthly: 0,
    yearly: null,
    credits: 120,
    voiceMinutes: 15,
    sttMinutes: 30,
    agents: 1,
    concurrency: 2,
    rollover: null,
    highlighted: false,
    cta: "Get started",
    href: "https://dashboard.omnia-voice.com/login",
  },
  {
    name: "Starter",
    description: "For side projects",
    monthly: 9,
    yearly: 90,
    credits: 900,
    voiceMinutes: 112,
    sttMinutes: 225,
    agents: 3,
    concurrency: 5,
    rollover: null,
    highlighted: false,
    cta: "Get started",
    href: "https://dashboard.omnia-voice.com/login",
  },
  {
    name: "Creator",
    description: "For growing apps",
    monthly: 29,
    yearly: 290,
    credits: 3000,
    voiceMinutes: 375,
    sttMinutes: 750,
    agents: 7,
    concurrency: 10,
    rollover: null,
    highlighted: false,
    cta: "Get started",
    href: "https://dashboard.omnia-voice.com/login",
  },
  {
    name: "Pro",
    description: "For professionals",
    monthly: 99,
    yearly: 990,
    credits: 10000,
    voiceMinutes: 1250,
    sttMinutes: 2500,
    agents: 20,
    concurrency: 20,
    rollover: "1 month",
    highlighted: true,
    cta: "Get started",
    href: "https://dashboard.omnia-voice.com/login",
  },
  {
    name: "Scale",
    description: "For scaling teams",
    monthly: 299,
    yearly: 2990,
    credits: 32000,
    voiceMinutes: 4000,
    sttMinutes: 8000,
    agents: 50,
    concurrency: 30,
    rollover: "2 months",
    highlighted: false,
    cta: "Get started",
    href: "https://dashboard.omnia-voice.com/login",
  },
  {
    name: "Business",
    description: "For organizations",
    monthly: 599,
    yearly: 5990,
    credits: 70000,
    voiceMinutes: 8750,
    sttMinutes: 17500,
    agents: "unlimited",
    concurrency: 40,
    rollover: "3 months",
    highlighted: false,
    cta: "Get started",
    href: "https://dashboard.omnia-voice.com/login",
  },
  {
    name: "Business Plus",
    description: "For large teams",
    monthly: 999,
    yearly: 9990,
    credits: 130000,
    voiceMinutes: 16250,
    sttMinutes: 32500,
    agents: "unlimited",
    concurrency: 50,
    rollover: "3 months",
    highlighted: false,
    cta: "Get started",
    href: "https://dashboard.omnia-voice.com/login",
  },
  {
    name: "Enterprise",
    description: "Custom solutions",
    monthly: "Custom",
    yearly: "Custom",
    credits: "Custom",
    voiceMinutes: "Custom",
    sttMinutes: "Custom",
    agents: "unlimited",
    concurrency: "100+",
    rollover: "Custom",
    highlighted: false,
    cta: "Contact sales",
    href: "/contact",
  },
];

const formatNumber = (num: number | string): string => {
  if (typeof num === "string") return num;
  return num.toLocaleString();
};

const PricingSection = () => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  return (
    <section className="bg-[#FAFAF9] py-24 md:py-32">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
            PRICING
          </span>
          <h2 className="mt-4 font-heading text-3xl text-[#1a1a1a] md:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-[#1a1a1a]/60 md:text-lg">
            Start free, scale as you grow. All plans include the same API and features.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              billingPeriod === "monthly"
                ? "bg-[#1a1a1a] text-white"
                : "text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              billingPeriod === "yearly"
                ? "bg-[#1a1a1a] text-white"
                : "text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
            }`}
          >
            Yearly
            <span className="bg-[#2D5A27]/10 px-2 py-0.5 text-xs text-[#2D5A27]">
              Save 17%
            </span>
          </button>
        </div>

        {/* Pricing table - Desktop */}
        <div className="mt-12 hidden overflow-x-auto lg:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1a1a1a]/10">
                <th className="px-4 py-4 text-left text-xs font-medium tracking-wide text-[#1a1a1a]/40">
                  PLAN
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium tracking-wide text-[#1a1a1a]/40">
                  PRICE
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium tracking-wide text-[#1a1a1a]/40">
                  CREDITS/MO
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium tracking-wide text-[#1a1a1a]/40">
                  VOICE MIN
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium tracking-wide text-[#1a1a1a]/40">
                  STT MIN
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium tracking-wide text-[#1a1a1a]/40">
                  AGENTS
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium tracking-wide text-[#1a1a1a]/40">
                  CONCURRENCY
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium tracking-wide text-[#1a1a1a]/40">
                  ROLLOVER
                </th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan.name}
                  className={`border-b border-[#1a1a1a]/10 transition-colors hover:bg-white/50 ${
                    plan.highlighted ? "bg-[#2D5A27]/[0.03]" : ""
                  }`}
                >
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-lg text-[#1a1a1a]">
                        {plan.name}
                      </span>
                      {plan.highlighted && (
                        <span className="bg-[#2D5A27]/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#2D5A27]">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-[#1a1a1a]/50">
                      {plan.description}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    {typeof plan.monthly === "number" ? (
                      <div>
                        <span className="font-heading text-2xl text-[#1a1a1a]">
                          ${billingPeriod === "monthly" ? plan.monthly : plan.yearly}
                        </span>
                        <span className="text-sm text-[#1a1a1a]/50">
                          /{billingPeriod === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>
                    ) : (
                      <span className="font-heading text-lg text-[#1a1a1a]">
                        Custom
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-5 text-sm text-[#1a1a1a]/70">
                    {formatNumber(plan.credits)}
                  </td>
                  <td className="px-4 py-5 text-sm text-[#1a1a1a]/70">
                    {formatNumber(plan.voiceMinutes)}
                  </td>
                  <td className="px-4 py-5 text-sm text-[#1a1a1a]/70">
                    {formatNumber(plan.sttMinutes)}
                  </td>
                  <td className="px-4 py-5 text-sm text-[#1a1a1a]/70">
                    {plan.agents === "unlimited" ? (
                      <Infinity className="size-4 text-[#2D5A27]" />
                    ) : (
                      plan.agents
                    )}
                  </td>
                  <td className="px-4 py-5 text-sm text-[#1a1a1a]/70">
                    {plan.concurrency}
                  </td>
                  <td className="px-4 py-5 text-sm text-[#1a1a1a]/70">
                    {plan.rollover || "—"}
                  </td>
                  <td className="px-4 py-5">
                    <Link
                      href={plan.href}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                        plan.highlighted
                          ? "bg-[#2D5A27] text-white hover:bg-[#2D5A27]/90"
                          : "border border-[#1a1a1a]/20 text-[#1a1a1a] hover:border-[#1a1a1a]/40"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing cards - Mobile */}
        <div className="mt-12 grid gap-4 lg:hidden">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`border p-6 ${
                plan.highlighted
                  ? "border-[#2D5A27]/30 bg-[#2D5A27]/[0.03]"
                  : "border-[#1a1a1a]/10 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xl text-[#1a1a1a]">
                      {plan.name}
                    </span>
                    {plan.highlighted && (
                      <span className="bg-[#2D5A27]/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-[#2D5A27]">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-[#1a1a1a]/50">
                    {plan.description}
                  </div>
                </div>
                {typeof plan.monthly === "number" ? (
                  <div className="text-right">
                    <span className="font-heading text-2xl text-[#1a1a1a]">
                      ${billingPeriod === "monthly" ? plan.monthly : plan.yearly}
                    </span>
                    <span className="text-sm text-[#1a1a1a]/50">
                      /{billingPeriod === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                ) : (
                  <span className="font-heading text-xl text-[#1a1a1a]">
                    Custom
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-[#1a1a1a]/40">Credits</span>
                  <div className="text-[#1a1a1a]">{formatNumber(plan.credits)}</div>
                </div>
                <div>
                  <span className="text-[#1a1a1a]/40">Voice min</span>
                  <div className="text-[#1a1a1a]">{formatNumber(plan.voiceMinutes)}</div>
                </div>
                <div>
                  <span className="text-[#1a1a1a]/40">STT min</span>
                  <div className="text-[#1a1a1a]">{formatNumber(plan.sttMinutes)}</div>
                </div>
                <div>
                  <span className="text-[#1a1a1a]/40">Agents</span>
                  <div className="flex items-center text-[#1a1a1a]">
                    {plan.agents === "unlimited" ? (
                      <Infinity className="size-4 text-[#2D5A27]" />
                    ) : (
                      plan.agents
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[#1a1a1a]/40">Concurrency</span>
                  <div className="text-[#1a1a1a]">{plan.concurrency}</div>
                </div>
                <div>
                  <span className="text-[#1a1a1a]/40">Rollover</span>
                  <div className="text-[#1a1a1a]">{plan.rollover || "—"}</div>
                </div>
              </div>

              <Link
                href={plan.href}
                className={`mt-4 flex w-full items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
                  plan.highlighted
                    ? "bg-[#2D5A27] text-white hover:bg-[#2D5A27]/90"
                    : "border border-[#1a1a1a]/20 text-[#1a1a1a] hover:border-[#1a1a1a]/40"
                }`}
              >
                {plan.cta}
                <ArrowRight className="size-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#1a1a1a]/50">
            All plans include EU data residency, API access, and documentation.{" "}
            <Link
              href="/contact"
              className="text-[#1a1a1a] underline underline-offset-4 hover:text-[#2D5A27]"
            >
              Contact us
            </Link>{" "}
            for volume discounts.
          </p>
        </div>
      </div>
    </section>
  );
};

export { PricingSection };
