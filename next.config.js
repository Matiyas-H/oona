// // FIX: I changed .mjs to .js 
// // More info: https://github.com/shadcn-ui/taxonomy/issues/100#issuecomment-1605867844

// const { createContentlayerPlugin } = require("next-contentlayer");

// import("./env.mjs");

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'avatars.githubusercontent.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'randomuser.me'
//       }
//     ],
//   },
//   experimental: {
//     serverComponentsExternalPackages: ["@prisma/client"],
//   },
// }

// const withContentlayer = createContentlayerPlugin({
//   // Additional Contentlayer config options
// });

// module.exports = withContentlayer(nextConfig);



const { createContentlayerPlugin } = require("next-contentlayer");

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me'
      }
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  async redirects() {
    // Documentation lives at guide.omnia-voice.com (Mintlify, repo
    // Matiyas-H/documentation). /docs and /guides on this domain previously
    // served the shadcn starter-kit boilerplate — "Welcome to the Next SaaS
    // Stripe Starter documentation" — which was publicly indexed under our
    // brand. Both are now permanently redirected to the real docs.
    //
    // A 301 rather than a proxy: one canonical hostname, no duplicate content
    // split across two domains, and no dependency on an upstream rewrite
    // target staying correct.
    return [
      { source: "/docs", destination: "https://guide.omnia-voice.com", permanent: true },
      { source: "/docs/:path*", destination: "https://guide.omnia-voice.com/:path*", permanent: true },
      { source: "/guides", destination: "https://guide.omnia-voice.com", permanent: true },
      { source: "/guides/:path*", destination: "https://guide.omnia-voice.com", permanent: true },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/.well-known/agent-skills/index.json",
        destination: "/api/well-known/agent-skills",
      },
    ];
  },
  async headers() {
    const linkHeader = [
      '</sitemap.xml>; rel="sitemap"; type="application/xml"',
      '</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"',
      // Advertised the way documentation platforms do, so an agent fetching the
      // homepage discovers the index without having to guess the filename.
      '</llms.txt>; rel="llms-txt"; type="text/plain"',
      '</llms-full.txt>; rel="llms-full-txt"; type="text/plain"',
      '</llm.txt>; rel="describedby"; type="text/plain"',
      '<https://guide.omnia-voice.com>; rel="service-doc"; type="text/html"',
    ].join(", ");

    return [
      {
        source: "/",
        headers: [
          { key: "Link", value: linkHeader },
          { key: "Vary", value: "Accept" },
        ],
      },
    ];
  },
}

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
});

module.exports = withContentlayer(nextConfig);