import { siteConfig } from "@/site.config";
import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title(siteConfig.title)
    .items([
      // Shop
      S.documentTypeListItem("order").title("Orders"),
      S.documentTypeListItem("product").title("Products"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("productColor").title("Colors"),

      S.divider(),

      // Services & Bookings
      S.documentTypeListItem("booking").title("Bookings"),
      S.documentTypeListItem("inquiry").title("Inquiries"),
      S.documentTypeListItem("customer").title("Customers"),

      S.divider(),

      // Content
      S.documentTypeListItem("hero").title("Hero Images"),
      S.documentTypeListItem("gallery").title("Gallery"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("social").title("Social Handles"),

      S.divider(),

      // Settings
      S.documentTypeListItem("businessHours").title("Business Hours"),
      S.documentTypeListItem("faq").title("Frequently Asked Questions"),
      S.documentTypeListItem("pricingTier").title("Pricing Tiers"),
    ]);
