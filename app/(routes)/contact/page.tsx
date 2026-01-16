import { Metadata } from "next";
import { ContactFormComp } from "./_components/contact-form.comp";

export const metadata: Metadata = {
  title: "Let's Talk",
  description:
    "Get in touch with us for any inquiries, support, or feedback. We're here to help and would love to hear from you!",
};

export default function ContactPage() {
  return (
    <div className="flex-1 overflow-x-clip">
      <ContactFormComp />
    </div>
  );
}
