import { env } from "./lib/env";

const siteConfig = {
  title: "Ekimedo Atelier",
  tagline: "Where luxury meets timeless designs",
  description:
    "Custom Bridals dresses, Robes and evening Gowns for your special occasions!",
  url:
    process.env.NODE_ENV === "production"
      ? env.NEXT_PUBLIC_SITE_URL
      : "http://localhost:3000",
};

type SiteConfigType = typeof siteConfig;

export { siteConfig, type SiteConfigType };
