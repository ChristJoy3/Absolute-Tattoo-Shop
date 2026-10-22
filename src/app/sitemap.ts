import type { MetadataRoute } from "next";
import { shop } from "@/data/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${shop.siteUrl}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
