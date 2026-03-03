import { siteConfig } from "@/site.config";
import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title(siteConfig.title)
    .items([
      // Shop
      S.documentTypeListItem("order").title("Orders"), // ✅
      S.documentTypeListItem("product").title("Products"), // ✅
      S.documentTypeListItem("category").title("Categories"), // ✅
      S.documentTypeListItem("productColor").title("Colors"), // ✅

      S.divider(),

      // Services & Bookings
      S.documentTypeListItem("booking").title("Bookings"), // ✅
      S.documentTypeListItem("inquiry").title("Inquiries"), // ✅
      S.documentTypeListItem("customer").title("Customers"), // ✅

      S.divider(),

      // Content
      S.documentTypeListItem("hero").title("Hero Images"), // ✅

      S.listItem()
        .title("Gallery")
        .child(
          S.list()
            .title("Gallery")
            .items([
              S.listItem()
                .title("All")
                .child(S.documentTypeList("gallery").title("All Galleries")),

              S.divider(),

              S.listItem()
                .title("Bridal Dresses")
                .child(
                  S.documentList()
                    .title("Bridal Dresses")
                    .filter(
                      `_type == "gallery" && category->slug.current == "bridal-dresses"`,
                    ),
                ),

              S.listItem()
                .title("Prom Dresses")
                .child(
                  S.documentList()
                    .title("Prom Dresses")
                    .filter(
                      `_type == "gallery" && category->slug.current == "prom-dresses"`,
                    ),
                ),

              S.listItem()
                .title("Special Events")
                .child(
                  S.documentList()
                    .title("Special Events")
                    .filter(
                      `_type == "gallery" && category->slug.current == "special-events"`,
                    ),
                ),

              S.divider(),

              S.listItem()
                .title("Featured")
                .child(
                  S.documentList()
                    .title("Featured Galleries")
                    .filter(`_type == "gallery" && featured == true`),
                ),
            ]),
        ),

      S.documentTypeListItem("testimonial").title("Testimonials"), // ✅
      S.documentTypeListItem("social").title("Social Handles"), // ✅

      S.divider(),

      // Settings
      S.documentTypeListItem("pricingTier").title("Pricing Tiers"), // ✅
      S.documentTypeListItem("businessHours").title("Business Hours"), // ✅
      S.documentTypeListItem("faq").title("Frequently Asked Questions"), // ✅
      S.documentTypeListItem("permissions").title("Testimonial Permission"), // ✅
    ]);
