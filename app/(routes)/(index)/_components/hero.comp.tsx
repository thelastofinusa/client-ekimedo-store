import { HERO_QUERY } from "@/sanity/queries/hero";
import { HeroSlider } from "./hero-slider";
import { sanityFetch } from "@/sanity/lib/live";

export const HeroComp = async () => {
  const { data: images } = await sanityFetch({ query: HERO_QUERY });

  // Fallback if no images are found
  const heroImages =
    images && images.length > 0
      ? images.map((img) => img.image).filter(Boolean)
      : ["/og.png", "/twitter-image.png"];

  return <HeroSlider images={heroImages as string[]} />;
};
