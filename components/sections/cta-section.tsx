"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="bg-[#1a1a1a] py-24 md:py-32">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl text-white md:text-4xl lg:text-5xl">
            Ready to build?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
            Start with our cloud platform — no credit card required.
            Upgrade to dedicated or self-hosted when you're ready.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="https://dashboard.omnia-voice.com/login"
              className="group inline-flex h-14 items-center justify-center gap-3 bg-white px-8 text-sm font-medium tracking-wide text-[#1a1a1a] transition-all hover:bg-white/90"
            >
              START BUILDING
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 items-center justify-center border border-white/20 px-8 text-sm font-medium tracking-wide text-white transition-all hover:border-white/40 hover:bg-white/5"
            >
              TALK TO SALES
            </Link>
          </div>

          <p className="mt-8 text-sm text-white/30">
            From $0.05/minute · No commitment · Enterprise options available
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export { CTASection };
