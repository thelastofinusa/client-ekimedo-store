import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { siteConfig } from "@/site.config";
import { HeroComp } from "./_components/hero.comp";
import { consultationsData } from "@/lib/constants/consultation";
import { BookingForm } from "./_components/booking-form";

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
  if (type === "try-on") return redirect("/consultation/try-on");

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp
        image={config.image}
        title={config.title}
        description={config.description}
      />
      <BookingForm
        config={config}
        type={type as (typeof consultationsData)[number]["slug"]}
      />
    </div>
  );
}
