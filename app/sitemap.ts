import { siteConfig } from "@/config/site.config";
import { MetadataRoute } from "next";

// Simulating an API call to get all custom gown slugs/IDs
async function getGownSlugs(): Promise<
  { slug: string; lastModified: string }[]
> {
  // In a real application, this would fetch from a database or CMS
  // e.g., const res = await fetch('https://api.yoursite.com/gowns');
  //       const gowns = await res.json();

  return [{ slug: "the-celine-gown", lastModified: "2025-12-01" }];
}
// ----------------------------------------------------------------

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const gowns = await getGownSlugs();

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0, // Highest priority for the homepage
    },
    {
      url: `${siteConfig.url}/consultation`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/bridal-gowns`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/evening-wear`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date("2025-09-01"), // Only update if your 'About' page changes
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. Dynamic Gown Pages
  const dynamicGownPages: MetadataRoute.Sitemap = gowns.map((gown) => ({
    url: `${siteConfig.url}/shop/${gown.slug}`,
    lastModified: gown.lastModified,
    changeFrequency: "weekly",
    priority: 0.9, // High priority for product pages
  }));

  // Combine static and dynamic URLs
  return [...staticPages, ...dynamicGownPages];
}
