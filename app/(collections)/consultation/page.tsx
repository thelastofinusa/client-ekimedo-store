import React from "react";
import type { Metadata } from "next";

import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: "Private Consultation",
  description: `Schedule a private consultation with ${siteConfig.title} to translate your bridal, prom, or special-event vision into a bespoke couture gown.`,
};

export default function Consultation() {
  return <div>Consultation</div>;
}
