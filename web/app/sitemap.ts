import type { MetadataRoute } from "next";

const BASE_URL = "https://lackim.github.io/shipcli";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/docs`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
