import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Omnia Voice",
  description:
    "",
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
