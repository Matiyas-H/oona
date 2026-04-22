export const dynamic = "force-static";

const index = {
  $schema:
    "https://raw.githubusercontent.com/cloudflare/agent-skills-discovery-rfc/main/schemas/index-v0.2.0.json",
  name: "Omnia Voice",
  description:
    "Agent-discovery index for Omnia Voice — audio-native real-time voice AI platform.",
  skills: [] as Array<{
    name: string;
    type: string;
    description: string;
    url: string;
    sha256: string;
  }>,
};

export async function GET() {
  return new Response(JSON.stringify(index, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
