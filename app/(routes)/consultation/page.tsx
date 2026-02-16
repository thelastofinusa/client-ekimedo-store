import { Metadata } from "next";
import { HeroComp } from "./_components/hero.comp";

import { Services } from "./_components/services";
import { CTA } from "@/components/shared/cta";
import { siteConfig } from "@/site.config";
import { consultationsData } from "@/lib/constants/consultation";

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

export default async function ConsultationPage(
  props: PageProps<"/consultation/[type]">,
) {
  const { success, canceled } = await props.searchParams;

  const messageType =
    success === "true" ? "success" : canceled === "true" ? "canceled" : null;

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <Services services={consultationsData} messageType={messageType} />
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
