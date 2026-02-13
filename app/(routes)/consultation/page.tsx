import { Metadata } from "next";
import { HeroComp } from "./_components/hero.comp";

import { Services } from "./_components/services";
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICE_QUERY } from "@/sanity/queries/service";
import { CTA } from "@/components/shared/cta";
import { siteConfig } from "@/site.config";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "The Consultation fee goes toward dress production if you wish to move forward with the process, otherwise The Consultation fee is NONREFUNDABLE.",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Book a Consultation",
    siteName: siteConfig.title,
    description:
      "The Consultation fee goes toward dress production if you wish to move forward with the process, otherwise The Consultation fee is NONREFUNDABLE.",
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
    title: "Book a Consultation",
    description:
      "The Consultation fee goes toward dress production if you wish to move forward with the process, otherwise The Consultation fee is NONREFUNDABLE.",
    images: ["/twitter-image.png"],
  },
};

interface ConsultationPageProps {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}

export default async function ConsultationPage({
  searchParams,
}: ConsultationPageProps) {
  const { data: services } = await sanityFetch({ query: SERVICE_QUERY });
  const params = await searchParams;
  const messageType =
    params.success === "true"
      ? "success"
      : params.canceled === "true"
        ? "canceled"
        : null;

  if (!services.length) return redirect("/");

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <Services services={services} messageType={messageType} />
      <CTA
        mode="dark"
        title="Ready to Begin?"
        description="Let's create a style that's uniquely you. Contact us to discuss your needs and book your first consultation."
        route={{
          txt: "Get in touch",
          path: "/contact",
        }}
      />
    </div>
  );
}
