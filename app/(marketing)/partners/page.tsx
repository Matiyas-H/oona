import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Partners",
  description: "Our partners bring the integrations, infrastructure, implementation expertise, and ongoing care that makes voice AI work in production.",
};

const partners = [
  {
    name: "Nitor",
    description: "Digital engineering company based in Helsinki",
    clients: "Finnair, DNA, Marimekko, Posti, OP Financial Group, SOK, Elisa, Kesko",
    content: "Nitor builds on Omnia Voice and integrates it into their own clients' systems. They also work directly with Omnia Voice customers — when a project requires serious integration work, ongoing care, or long-term technical support, Nitor is the partner we bring in. Whether the project originates from Nitor's side or ours, they handle the architecture, the integration, and the engineering commitment that keeps it running over time.",
    footer: "If your project needs integration, ongoing care, or long-term technical support, reach out to Nitor directly or get in touch with us and we will connect you.",
    size: "300-person · Offices in Helsinki and Tampere",
    website: "https://www.nitor.com",
    logo: "/images/partners/nitor.png",
    logoBg: "#FFFFFF",
  },
  {
    name: "Houston Inc.",
    description: "Digital services company with over two decades of experience",
    clients: "Telia, Elisa, Wärtsilä, Helsingin Sanomat",
    content: "Their AI customer service practice deploys Omnia Voice for clients who need intelligent, multilingual voice AI that handles real customer interactions at scale. Houston Inc. owns the full delivery — strategy, implementation, and ongoing service.",
    footer: "If your project is centred around customer service and you need a partner who handles everything end to end, reach out to Houston Inc. directly or get in touch with us and we will connect you.",
    size: "Helsinki-based",
    website: "https://www.houston-inc.com",
    logo: "/images/partners/houston-inc.png",
    logoBg: "#D4C4D4",
    caseStudyLink: "https://www.houston-inc.com/palvelut/ai-customer-service-solutions/",
    caseStudyText: "See how Houston Inc. is deploying Omnia Voice for their clients",
  },
  {
    name: "Setera Communications",
    description: "Cloud PBX and UCaaS operator present in more than 50 countries",
    clients: "Hilton, DHL, Nokia, Kone, Neste, Microsoft",
    content: "When a project needs the telecom backbone — phone numbers, SIP trunks, Cloud PBX, or enterprise telephony infrastructure — Setera is where that starts. Omnia Voice sits on top of Setera's infrastructure to add the AI layer.",
    footer: "If your use case involves enterprise telephony, SIP trunks, phone numbers, or multi-site communications across multiple countries, reach out to Setera directly or get in touch with us and we will connect you.",
    size: "Offices in Helsinki, London, Madrid, Milan, Rome and New York",
    website: "https://www.setera.com",
    logo: "/images/partners/setera.webp",
    logoBg: "#FFFFFF",
  },
];

export default function PartnersPage() {
  return (
    <div className="flex w-full flex-col">
      {/* Hero Section */}
      <section className="bg-[#FAFAF9] py-24 md:py-32">
        <div className="container max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 border border-[#1a1a1a]/10 bg-white px-4 py-2 text-xs font-medium tracking-wide text-[#1a1a1a]/70">
              <span className="size-1.5 rounded-full bg-[#2D5A27]" />
              ECOSYSTEM
            </div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-[#1a1a1a] md:text-5xl lg:text-6xl">
              Partners
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#1a1a1a]/60 md:text-xl">
              Our partners are the companies that bring everything around our technology — the integrations, the infrastructure, the implementation expertise, and the ongoing care that makes voice AI work in production over the long term.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-[#1a1a1a]/60 md:text-lg">
              Depending on what your project needs, one or more of our partners may be exactly who you need to talk to.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="container max-w-5xl">
          <div className="space-y-8">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="group border border-[#1a1a1a]/10 bg-white p-8 transition-all hover:border-[#1a1a1a]/20 md:p-10"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
                  {partner.logo && (
                    <div
                      className="flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden md:h-28 md:w-48"
                      style={{ backgroundColor: partner.logoBg || '#f5f5f5' }}
                    >
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        width={180}
                        height={120}
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="font-heading text-2xl font-semibold text-[#1a1a1a] md:text-3xl">
                        {partner.name}
                      </h2>
                    </div>
                    <p className="mt-2 text-sm text-[#1a1a1a]/50">
                      {partner.size} · {partner.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {partner.clients.split(", ").map((client) => (
                        <span
                          key={client}
                          className="border border-[#1a1a1a]/10 px-3 py-1 text-xs text-[#1a1a1a]/60"
                        >
                          {client}
                        </span>
                      ))}
                    </div>
                    <p className="mt-6 leading-relaxed text-[#1a1a1a]/70">
                      {partner.content}
                    </p>
                    {partner.footer && (
                      <p className="mt-4 leading-relaxed text-[#1a1a1a]/70">
                        {partner.footer}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 border-t border-[#1a1a1a]/10 pt-6 sm:flex-row sm:items-center sm:gap-6">
                  <Link
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#2D5A27] transition-colors hover:text-[#2D5A27]/80"
                  >
                    {partner.website.replace("https://www.", "")}
                    <ArrowUpRight className="size-4" />
                  </Link>
                  {partner.caseStudyLink && (
                    <Link
                      href={partner.caseStudyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[#1a1a1a] transition-colors hover:text-[#2D5A27]"
                    >
                      {partner.caseStudyText}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="bg-[#1a1a1a] py-16 md:py-24">
        <div className="container max-w-3xl text-center">
          <h2 className="font-heading text-3xl text-white md:text-4xl">
            Become a partner
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60 md:text-lg">
            We work with implementation partners, resellers, and technology companies who are building voice AI into their products and services across the Nordics and beyond. If that sounds like you, we would like to hear from you.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-white px-8 py-3 text-sm font-medium tracking-wide text-[#1a1a1a] transition-colors hover:bg-white/90"
          >
            Get in touch
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
