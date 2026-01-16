import { env } from "./lib/env";

const siteConfig = {
  title: "Ekimedo",
  tagline: "Where luxury meets timeless designs",
  description:
    "Our elegant designs blend tradition with contemporary style, ensuring you shine on your special day and beyond.",
  url:
    process.env.NODE_ENV === "production"
      ? env.NEXT_PUBLIC_SITE_URL
      : "http://localhost:3000",
};

type SiteConfigType = typeof siteConfig;

export { siteConfig, type SiteConfigType };
