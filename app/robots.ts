import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*", // Applies to all web crawlers (Google, Bing, etc.)
        allow: [
          "/", // Homepage
          "/bridal-gowns", // Main category page
          "/evening-wear", // Main category page
          "/shop/", // All product/item pages (e.g., /shop/the-celine-gown)
          "/consultation", // Booking page
          "/about",
          "/contact",
        ],
        disallow: [
          "/admin/", // Administration dashboard
          "/account/", // User profile/data (for security)
          "/api/", // API endpoints
          "/cart", // Cart page (often changes)
          "/checkout", // Checkout process
          "/terms", // Low value, but allow if important for trust
        ],
      },
    ],
    // Link to your sitemap (Crucial for getting all pages indexed)
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
