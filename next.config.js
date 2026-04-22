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
      '</llm.txt>; rel="describedby"; type="text/plain"',
      '</docs>; rel="service-doc"; type="text/html"',
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