"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const partners = [
  {
    name: "Nitor",
    logo: "/images/partners/nitor.png",
    logoBg: "#FFFFFF",
  },
  {
    name: "Houston Inc.",
    logo: "/images/partners/houston-inc.png",
    logoBg: "#D4C4D4",
  },
  {
    name: "Setera",
    logo: "/images/partners/setera.webp",
    logoBg: "#FFFFFF",
  },
];

const PartnersSection = () => {
  return (
    <section className="border-t border-[#1a1a1a]/10 bg-white py-16 md:py-20">
      <div className="container max-w-6xl">
        <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between md:gap-8">
          {/* Left text */}
          <div className="max-w-md text-center md:text-left">
            <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
              PARTNER ECOSYSTEM
            </span>
            <h3 className="mt-3 font-heading text-2xl text-[#1a1a1a] md:text-3xl">
              Our partners
            </h3>
            <p className="mt-3 text-sm text-[#1a1a1a]/60">
              Our partners bring the integrations, infrastructure, and expertise
              that makes voice AI work in production.
            </p>
            <Link
              href="/partners"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#2D5A27] transition-colors hover:text-[#2D5A27]/80"
            >
              View all partners
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Partner logos */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
          >
            {partners.map((partner) => (
              <Link
                key={partner.name}
                href="/partners"
                className="flex h-16 w-28 items-center justify-center overflow-hidden border border-[#1a1a1a]/10 transition-all hover:border-[#1a1a1a]/20 md:h-20 md:w-36"
                style={{ backgroundColor: partner.logoBg }}
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={120}
                  height={60}
                  className="h-auto w-full object-contain p-2"
                />
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { PartnersSection };
