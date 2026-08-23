import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Omnia Voice",
  // Feeds <meta name="description">, og:description and twitter:description
  // via app/layout.tsx. It was an empty string, so Next omitted the tags
  // entirely — every page shipped with no description and every shared link
  // rendered a blank card.
  description:
    "Build voice AI agents that answer the phone, use your tools, and speak 50+ languages. Audio-native, ~250ms response, EU-hosted or self-hosted.",
  url: site_url,
  ogImage: `${site_url}/og.jpg`,
  links: {
    twitter: "/",
    github: "/",
  },
  mailSupport: "support@omnia-voice.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "Partners", href: "/partners" },
      { title: "Pricing", href: "/pricing" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Content",
    items: [
      { title: "Docs", href: "https://guide.omnia-voice.com" },
      { title: "Blog", href: "/blog" },
      { title: "Healthcare AI", href: "/blog/ai-voice-automation-healthcare-transformation" },
      { title: "IT Support AI", href: "/blog/ai-voice-automation-it-support-jira-integration" },
    ],
  },
  {
    title: "Legal",
    items: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms & Conditions", href: "/terms" },
    ],
  },
];
