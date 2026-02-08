import { Metadata } from "next";
import { ContactFormComp } from "./_components/contact-form.comp";
import { FilteredResponseQueryOptions } from "@sanity/client/stega";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";
import { client } from "@/sanity/lib/client";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with us for any inquiries, support, or feedback. We're here to help and would love to hear from you!",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Contact Us",
    siteName: siteConfig.title,
    description:
      "Get in touch with us for any inquiries, support, or feedback. We're here to help and would love to hear from you!",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us",
    description:
      "Get in touch with us for any inquiries, support, or feedback. We're here to help and would love to hear from you!",
    images: ["/twitter-image.png"],
  },
};

export default async function ContactPage() {
  const options: FilteredResponseQueryOptions = { next: { revalidate: 30 } };
  const categories = await client.fetch(CATEGORIES_QUERY, {}, options);

  return (
    <div className="flex-1 overflow-x-clip">
      <ContactFormComp categories={categories} />
    </div>
  );
}
