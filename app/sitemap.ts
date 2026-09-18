import type { MetadataRoute } from "next";
import { products } from "@/lib/content";
import { resources } from "@/lib/resources";

const BASE_URL = "https://www.unityinsurancepr.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date("2026-09-12") },
    { url: `${BASE_URL}/nosotros`, lastModified: new Date("2026-09-12") },
    { url: `${BASE_URL}/recursos`, lastModified: new Date("2026-09-12") },
  ];

  const seguroRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/seguros/${p.id}`,
    lastModified: new Date("2026-09-12"),
  }));

  const recursoRoutes: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${BASE_URL}/recursos/${r.slug}`,
    lastModified: new Date("2026-09-12"),
  }));

  return [...staticRoutes, ...seguroRoutes, ...recursoRoutes];
}
