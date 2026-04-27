export const dynamic = "force-static";

const BASE_URL = "https://omnia-voice.com";

const BLOCKED_PATHS = [
  "/dashboard",
  "/dashboard/",
  "/api/",
  "/login",
  "/register",
  "/auth/",
];

function buildRobotsTxt(): string {
  const lines: string[] = [];

  // Content Signals (contentsignals.org) — declares AI usage preferences.
  // Public content is open to search, AI retrieval, and AI training.
  lines.push("# Content Signals — https://contentsignals.org");
  lines.push("Content-Signal: search=yes, ai-input=yes, ai-train=yes");
  lines.push("");

  // Single rule set for all crawlers (search, AI retrieval, AI training).
  // Only private/auth paths are off-limits.
  lines.push("User-agent: *");
  for (const path of BLOCKED_PATHS) {
    lines.push(`Disallow: ${path}`);
  }
  lines.push("Allow: /");
  lines.push("");

  lines.push(`Sitemap: ${BASE_URL}/sitemap.xml`);
  lines.push(`Host: ${BASE_URL}`);
  lines.push("");

  return lines.join("\n");
}

export async function GET() {
  return new Response(buildRobotsTxt(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
