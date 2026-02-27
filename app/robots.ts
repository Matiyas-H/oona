import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://omnia-voice.com/sitemap.xml",
    host: "https://omnia-voice.com",
  }
}
