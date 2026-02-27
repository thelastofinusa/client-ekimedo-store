import Link from "next/link";
import Image from "next/image";

import { clientOptions, cn } from "@/lib/utils";
import { buttonVariants } from "@/ui/button";
import { Container } from "@/components/shared/container";
import { GALLERY_QUERY } from "@/sanity/queries/gallery";
import { client } from "@/sanity/lib/client";

export const GalleryComp = async () => {
  const gallery = await client.fetch(GALLERY_QUERY, {}, clientOptions);

  return (
    <div className="bg-background">
      <div className="from-secondary via-secondary/50 overflow-x-clip bg-linear-to-b to-transparent py-24 lg:py-32">
        <Container size="sm">
          <div className="mb-10 flex items-end justify-between md:mb-20">
            <h2 className="font-serif text-4xl leading-tight capitalize md:text-5xl">
              discover our <br className="hidden md:block" /> signature style
            </h2>

            <Link
              href="/gallery"
              className={buttonVariants({
                className: "hidden! md:inline-flex!",
              })}
            >
              View Full Gallery
            </Link>
          </div>
        </Container>

        <Container>
          <div className="flex gap-4">
            {gallery.slice(0, 5).map((item, idx) => (
              <div
                key={item._id}
                className={cn("relative shrink-0 shadow-xs", {
                  "aspect-3/4 w-[50vw] md:w-[25vw]": idx % 2 === 0,
                  "mt-10 aspect-3/4 w-[40vw] md:w-[20vw]": idx % 2 !== 0,
                })}
              >
                <Image
                  src={item.image as string}
                  alt={`Look ${idx + 1}`}
                  fill
                  loading="lazy"
                  quality={100}
                  className="object-cover transition-all duration-700"
                />
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
};
