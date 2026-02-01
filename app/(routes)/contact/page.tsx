import { Metadata } from "next";
import { ContactFormComp } from "./_components/contact-form.comp";
import { FilteredResponseQueryOptions } from "@sanity/client/stega";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = {
  title: "Let's Talk",
  description:
    "Get in touch with us for any inquiries, support, or feedback. We're here to help and would love to hear from you!",
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
