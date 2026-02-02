import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brickx.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    { url: `${BASE_URL}`, changeFrequency: "daily" as const, priority: 1.0 },
    {
      url: `${BASE_URL}/sets`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/market`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/market/trending`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/market/retiring`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/market/new-releases`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/market/top-investments`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/sign-in`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/sign-up`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  entries.push(...staticPages);

  // Dynamic set detail pages
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const supabase = createClient<Database>(url, key);

    const { data: sets } = await supabase
      .from("sets")
      .select("id, updated_at")
      .order("id");

    if (sets) {
      for (const set of sets) {
        entries.push({
          url: `${BASE_URL}/sets/${set.id}`,
          lastModified: set.updated_at,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
