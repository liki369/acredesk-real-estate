import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/dashboard", "/admin/inventory"],
    },
    sitemap: "https://acredesk.vercel.app/sitemap.xml",
  };
}
