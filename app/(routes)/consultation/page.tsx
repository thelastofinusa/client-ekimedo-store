import { Metadata } from "next";
import { HeroComp } from "./_components/hero.comp";

import { Services } from "./_components/services";
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICE_QUERY } from "@/sanity/queries/service";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Read what our clients have to say about us.",
};

export default async function ConsultationPage() {
  const { data: services } = await sanityFetch({ query: SERVICE_QUERY });

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <Services services={services} />
    </div>
  );
}
