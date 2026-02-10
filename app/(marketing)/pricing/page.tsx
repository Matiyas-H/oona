import Link from "next/link";
import { PricingSection } from "@/components/sections/pricing-section";
import { PricingFaq } from "@/components/pricing-faq";

export const metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <div className="flex w-full flex-col">
      <PricingSection />
      <section className="bg-[#1a1a1a] py-16">
        <div className="container max-w-3xl text-center">
          <h3 className="font-heading text-2xl text-white md:text-3xl">
            Need a custom solution?
          </h3>
          <p className="mt-3 text-white/60">
            Get in touch for volume discounts, custom integrations, or enterprise requirements.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-white/90"
          >
            Contact sales
          </Link>
        </div>
      </section>
      <PricingFaq />
    </div>
  );
}
