// While the redesign lives under /redesign, links to the pages it has
// redesigned point at their previews. Delete this file at launch.
const previewPages: Record<string, string> = {
  "/pricing": "/redesign/pricing",
  "/partners": "/redesign/partners",
};

export const toPreview = (href: string): string =>
  previewPages[href] ??
  (href === "/blog" || href.startsWith("/blog/") ? `/redesign${href}` : href);

// Where Luna finds each section from any preview page.
export const lunaSectionPages: Record<string, string> = {
  hero: "/redesign#hero",
  playground: "/redesign#playground",
  features: "/redesign#features",
  code: "/redesign#code",
  deployment: "/redesign#deployment",
  faq: "/redesign#faq",
  contact: "/redesign#contact",
  pricing: "/redesign/pricing",
  partners: "/redesign/partners",
};

// The redesigned version of a live page, or the redesigned homepage when that
// page has no redesign yet. Used by the "try the new design" banner.
export function previewFor(pathname: string): string {
  if (pathname === "/") return "/redesign";
  const mapped = toPreview(pathname);
  return mapped === pathname ? "/redesign" : mapped;
}

// The live page a redesigned one previews. Used by "Back to the current site".
export const currentFor = (pathname: string): string =>
  pathname.replace(/^\/redesign/, "") || "/";
