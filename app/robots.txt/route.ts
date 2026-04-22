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

const AI_TRAINING_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "cohere-ai",
  "Cohere-training-data-crawler",
  "CCBot",
  "Bytespider",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "FacebookBot",
  "DuckAssistBot",
  "AI2Bot",
  "Diffbot",
  "ImagesiftBot",
  "omgili",
  "Timpibot",
  "YouBot",
];

function buildRobotsTxt(): string {
  const lines: string[] = [];

  // Content Signals (contentsignals.org) — declares AI usage preferences
  lines.push("# Content Signals — https://contentsignals.org");
  lines.push("Content-Signal: search=yes, ai-input=yes, ai-train=no");
  lines.push("");

  // Default rules for all well-behaved crawlers
  lines.push("User-agent: *");
  for (const path of BLOCKED_PATHS) {
    lines.push(`Disallow: ${path}`);
  }
  lines.push("Allow: /");
  lines.push("");

  // Explicit rules for AI training crawlers — opt out of training,
  // but allow retrieval-style bots by keeping default rules above.
  // Per policy: no use of site content for model training.
  for (const bot of AI_TRAINING_BOTS) {
    lines.push(`User-agent: ${bot}`);
    lines.push("Disallow: /");
    lines.push("");
  }

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
