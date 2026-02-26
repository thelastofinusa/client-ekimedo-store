import { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig } from "@/site.config";
import { HeroComp } from "@/components/shared/hero";
import { BookingForm } from "./_components/booking-form";
import { consultationsData } from "@/lib/constants/consultation";

export async function generateMetadata(
  props: PageProps<"/consultation/[type]">,
): Promise<Metadata> {
  const { type } = await props.params;

  const config = consultationsData.find((item) => item.slug === type);

  if (!config) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: config?.title || "Consultation",
    description: config?.description || "Book a dress consultation",
    openGraph: {
      type: "website",
      locale: "en_US",
      title: config?.title,
      siteName: siteConfig.title,
      description: config?.description,
      images: [
        {
          url: config?.image ?? "",
          width: 1200,
          height: 630,
          alt: config?.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config?.title,
      description: config?.description,
      images: [config?.image ?? ""],
    },
  };
}

export default async function ConsultationDetailsPage(
  props: PageProps<"/consultation/[type]">,
) {
  const { type } = await props.params;
  const config = consultationsData.find((item) => item.slug === type);

  if (!config) return notFound();

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp
        imagePath={config.image}
        title={config.title}
        description={config.description}
      />
      <BookingForm config={config} />
    </div>
  );
}
