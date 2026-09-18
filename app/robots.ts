import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/marca"],
      },
    ],
    sitemap: "https://www.unityinsurancepr.com/sitemap.xml",
  };
}
