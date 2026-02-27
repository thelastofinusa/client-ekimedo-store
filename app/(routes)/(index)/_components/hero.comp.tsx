import { HERO_QUERY } from "@/sanity/queries/hero";
import { HeroSlider } from "./hero-slider";
import { client } from "@/sanity/lib/client";
import { clientOptions } from "@/lib/utils";

export const HeroComp = async () => {
  const images = await client.fetch(HERO_QUERY, {}, clientOptions);

  // Fallback if no images are found
  const heroImages =
    images && images.length > 0
      ? images.map((img) => img.image).filter(Boolean)
      : ["/og.png", "/twitter-image.png"];

  return <HeroSlider images={heroImages as string[]} />;
};
