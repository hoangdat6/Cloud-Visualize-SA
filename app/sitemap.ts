import type { MetadataRoute } from "next";
import { getAllSimulations } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const simulations = getAllSimulations();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const simulationEntries: MetadataRoute.Sitemap = simulations.flatMap((s) => [
    {
      url: `${SITE.url}/s/${s.slug}`,
      lastModified: new Date(s.createdAt),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/s/${s.slug}/play`,
      lastModified: new Date(s.createdAt),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]);

  return [...staticEntries, ...simulationEntries];
}
