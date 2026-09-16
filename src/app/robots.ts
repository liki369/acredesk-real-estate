import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
        ],
      },
      {
        // Block automated AI scrapers and data-harvesting bots from scraping listings and code
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "ClaudeBot",
          "Bytespider",
          "Diffbot",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: "https://acredesk.vercel.app/sitemap.xml",
  };
}
