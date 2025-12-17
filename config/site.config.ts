import { env } from "@/lib/env";

export const siteConfig = {
  title: "Ekie Fashion",
  description:
    "Experience the art of custom luxury fashion. From bridal gowns to evening wear, we create one-of-a-kind pieces tailored to you.",
  keywords: [
    "custom bridal gowns",
    "luxury wedding dresses Maryland",
    "bespoke evening wear",
    "couture bridal robes",
    "African luxury fashion",
  ],
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : env.NEXT_PUBLIC_SITE_URL,
};
