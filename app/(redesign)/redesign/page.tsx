import Link from "next/link";

import { frame } from "@/components/redesign/frame";
import { Hero } from "@/components/redesign/hero";
import { ProductRows } from "@/components/redesign/product-rows";
import { Capabilities, Deployment, Faq } from "@/components/redesign/sections";
import { Playground } from "@/components/sections/playground";

// Section ids hero, playground, features, code, deployment, faq and contact
// are load-bearing: Luna navigates by them. Pricing and partners have their
// own pages (see preview-links.ts).

export default function RedesignPreviewPage() {
  return (
    <>
        <Hero />

        <div className="border-b border-[color:var(--ov-line)]">
          <div className={`${frame} ov-panel [&>section]:bg-transparent`}>
            <Playground
              header={
                <div className="mb-12 md:mb-16">
                  <h2 className="font-heading text-[2.25rem] leading-[1.05] tracking-[-0.01em] md:text-[3.5rem]">
                    Try it yourself.
                  </h2>
                  <p className="mt-4 max-w-[52ch] text-lg text-[color:var(--ov-muted)]">
                    Test our transcription accuracy, or talk to a voice agent.
                  </p>
                </div>
              }
            />
          </div>
        </div>

        <ProductRows />
        <Capabilities />
        <Deployment />
        <Faq />

        <section id="contact" className="border-b border-[color:var(--ov-line)]">
          <div className={`${frame} grid md:grid-cols-[minmax(0,1fr)_auto]`}>
            <div className="px-5 py-14 md:px-12 md:py-20">
              <h2 className="font-heading text-[2.5rem] leading-none tracking-[-0.01em] md:text-[4.5rem]">
                Start on our cloud.
                <br />
                Move when you&apos;re ready.
              </h2>
              <p className="mt-6 max-w-[48ch] text-lg text-[color:var(--ov-muted)]">
                Upgrade to dedicated or self-hosted whenever you need to. The
                API stays the same.
              </p>
            </div>
            <div className="flex border-t border-[color:var(--ov-line)] md:min-w-[380px] md:border-l md:border-t-0">
              <Link
                href="https://dashboard.omnia-voice.com/register"
                className="flex flex-1 items-center justify-center whitespace-nowrap bg-[color:var(--ov-brand)] px-8 py-6 font-medium text-[color:var(--ov-on-brand)] transition-colors hover:bg-[color:var(--ov-brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[color:var(--ov-accent)] md:py-10"
              >
                Start building
              </Link>
              <Link
                href="/contact"
                className="flex flex-1 items-center justify-center whitespace-nowrap border-l border-[color:var(--ov-line)] px-8 py-6 transition-colors hover:bg-[color:var(--ov-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[color:var(--ov-accent)] md:py-10"
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </section>
    </>
  );
}
