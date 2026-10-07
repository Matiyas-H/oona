import Image from "next/image";
import Link from "next/link";

import { partners } from "@/config/partners";
import { frame } from "@/components/redesign/frame";

export const metadata = {
  title: "Partners — redesign preview",
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const textLink =
  "self-start border-b border-[color:var(--ov-accent-line)] pb-0.5 text-[15px] text-[color:var(--ov-accent)] transition-colors hover:border-[color:var(--ov-accent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ov-accent)]";

export default function RedesignPartnersPage() {
  return (
    <>
      {/* id="partners" is Luna's navigation target. */}
      <section id="partners" className="border-b border-[color:var(--ov-line)]">
        <div className={`${frame} px-5 py-16 md:px-12 md:py-24`}>
          <h1 className="font-heading text-[3rem] leading-[0.95] tracking-[-0.02em] md:text-[5rem]">
            Partners.
          </h1>
          <p className="mt-8 max-w-[56ch] text-lg leading-relaxed text-[color:var(--ov-muted)] md:text-xl">
            Our partners bring everything around our technology: the
            integrations, the infrastructure, the implementation expertise, and
            the ongoing care that makes voice AI work in production over the
            long term. Depending on what your project needs, one or more of them
            may be exactly who you need to talk to.
          </p>
        </div>
      </section>

      <section className="border-b border-[color:var(--ov-line)]">
        <div className={`${frame} divide-y divide-[color:var(--ov-line)]`}>
          {partners.map((p) => (
            <article
              key={p.name}
              className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
            >
              <div className="flex flex-col gap-6 border-[color:var(--ov-line)] px-5 py-10 max-lg:border-b md:px-10 lg:border-r">
                <div
                  className="flex h-24 w-44 items-center justify-center px-5 py-4"
                  style={{ backgroundColor: p.logoBg }}
                >
                  <Image
                    src={p.logo}
                    alt={`${p.name} logo`}
                    width={180}
                    height={96}
                    className="h-full w-auto max-w-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-heading text-3xl">{p.name}</h2>
                  <p className="mt-2 text-[color:var(--ov-muted)]">{p.description}</p>
                  <p className="mt-1 text-sm text-[color:var(--ov-muted)]">{p.size}</p>
                </div>
                <div className="mt-auto flex flex-col gap-3">
                  <Link href={p.website} {...external} className={textLink}>
                    {p.website.replace("https://www.", "")}
                  </Link>
                  {"caseStudyLink" in p && p.caseStudyLink && (
                    <Link href={p.caseStudyLink} {...external} className={textLink}>
                      {p.caseStudyText}
                    </Link>
                  )}
                </div>
              </div>

              <div className="px-5 py-10 md:px-10">
                <p className="max-w-[62ch] text-lg leading-relaxed">{p.content}</p>
                <h3 className="mt-8 text-sm text-[color:var(--ov-muted)]">Their clients include</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.clients.split(", ").map((c) => (
                    <li key={c} className="border border-[color:var(--ov-line-strong)] px-3 py-1 text-sm">
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 max-w-[62ch] border-t border-[color:var(--ov-line)] pt-6 leading-relaxed text-[color:var(--ov-muted)]">
                  {p.footer}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-[color:var(--ov-line)]">
        <div className={`${frame} grid md:grid-cols-[minmax(0,1fr)_auto]`}>
          <div className="px-5 py-12 md:px-12 md:py-16">
            <h2 className="font-heading text-[2rem] leading-[1.05] md:text-[2.75rem]">
              Become a partner.
            </h2>
            <p className="mt-4 max-w-[60ch] text-lg text-[color:var(--ov-muted)]">
              We work with implementation partners, resellers, and technology
              companies who are building voice AI into their products and
              services across the Nordics and beyond. If that sounds like you,
              we would like to hear from you.
            </p>
          </div>
          <Link
            href="/contact"
            className="flex items-center justify-center border-t border-[color:var(--ov-line)] bg-[color:var(--ov-brand)] px-12 py-6 font-medium text-[color:var(--ov-on-brand)] transition-colors hover:bg-[color:var(--ov-brand-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[color:var(--ov-accent)] md:border-l md:border-t-0"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
