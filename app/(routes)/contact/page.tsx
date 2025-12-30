import type { Metadata } from "next";

import { siteConfig } from "@/config/site.config";
import { ContactFormComp } from "./_components/contact-form.comp";

export const metadata: Metadata = {
  title: "Contact the Atelier",
  description: `Get in touch with ${siteConfig.title} in Capitol Heights, Maryland to begin a bespoke bridal, prom, or special-event couture inquiry.`,
};

export default function Contact() {
  return (
    <div className="flex-1 overflow-x-clip">
      <ContactFormComp />
    </div>
  );
}
