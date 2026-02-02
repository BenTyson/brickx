import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brickx.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/collections/", "/portfolio/", "/alerts/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
