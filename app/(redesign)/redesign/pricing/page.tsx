import Link from "next/link";

import { pricingFaqData } from "@/components/pricing-faq";
import { frame } from "@/components/redesign/frame";
import { Faq, Pricing } from "@/components/redesign/sections";

export const metadata = {
  title: "Pricing — redesign preview",
};

export default function RedesignPricingPage() {
  return (
    <>
      <Pricing as="h1" />

      <section className="border-b border-[color:var(--ov-line)]">
        <div className={`${frame} grid md:grid-cols-[minmax(0,1fr)_auto]`}>
          <div className="px-5 py-12 md:px-12 md:py-16">
            <h2 className="font-heading text-[2rem] leading-[1.05] md:text-[2.75rem]">
              Need a custom solution?
            </h2>
            <p className="mt-4 max-w-[52ch] text-lg text-[color:var(--ov-muted)]">
              Get in touch for volume discounts, custom integrations, or
              enterprise requirements.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex items-center justify-center border-t border-[color:var(--ov-line)] bg-[color:var(--ov-brand)] px-12 py-6 font-medium text-[color:var(--ov-on-brand)] transition-colors hover:bg-[color:var(--ov-brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[color:var(--ov-accent)] md:border-l md:border-t-0"
          >
            Contact sales
          </Link>
        </div>
      </section>

      <Faq items={pricingFaqData} title="Pricing questions." lunaControlled={false} />
    </>
  );
}
