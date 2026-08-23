import { MetadataRoute } from "next";
import { allPosts, allPages } from "contentlayer/generated";

export default function sitemap(): MetadataRoute.Sitemap {
  // www, matching the canonical. The apex 301s here, so declaring the apex
  // pointed every sitemap entry at a redirect.
  const baseUrl = "https://www.omnia-voice.com";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/llm.txt`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];

  // Blog posts
  const blogPosts = allPosts.map((post) => ({
    url: `${baseUrl}${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // /docs and /guides are deliberately absent. They mapped over the shadcn
  // starter-kit content that used to be served here, and every one of those
  // URLs now 301s to guide.omnia-voice.com — so listing them asked crawlers to
  // spend budget on ~15 redirects and kept the dead URLs alive in the index.
  //
  // The real documentation is a separate Mintlify site with its own sitemap at
  // https://guide.omnia-voice.com/sitemap.xml.

  return [...staticPages, ...blogPosts];
}
