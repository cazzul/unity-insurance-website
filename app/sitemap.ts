import type { MetadataRoute } from "next";
import { products } from "@/lib/content";
import { resources } from "@/lib/resources";

const BASE_URL = "https://unityinsurancepr.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/recursos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const seguroRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/seguros/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const recursoRoutes: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${BASE_URL}/recursos/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...seguroRoutes, ...recursoRoutes];
}
