import { Container } from "@/components/shared/container";
import { COLLECTIONS } from "@/constants/collection";
import Image from "next/image";
import Link from "next/link";

export const CollectionComp = () => {
  return (
    <div
      id="collections"
      className="from-secondary via-secondary/50 bg-linear-to-t to-transparent py-24 lg:py-32"
    >
      <Container>
        <header className="mb-14 text-center md:mb-20">
          <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
            Collections
          </span>
          <h2 className="leading-[1.1]">Curated Selection</h2>
        </header>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-8">
          {COLLECTIONS.map((cat) => (
            <Link
              key={cat.slug}
              href={{ pathname: `/category/${cat.slug}` }}
              className="group block"
            >
              <div className="relative mb-4 aspect-3/4 overflow-hidden shadow-xs md:mb-8">
                <Image
                  src={cat.image || "/placeholder.svg"}
                  alt={cat.name}
                  fill
                  quality={100}
                  priority
                  className="origin-top object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="bg-foreground/0 group-hover:bg-foreground/20 absolute inset-0 transition-colors duration-500" />
                <div className="bg-background/50 absolute bottom-0 left-0 flex w-full items-center justify-center p-6 opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100">
                  <span className="text-background border-background border-b pb-1 text-xs tracking-widest uppercase">
                    Explore
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="mb-2 text-xl md:text-2xl">{cat.name}</h3>
                <p className="text-xs tracking-widest uppercase opacity-60">
                  {cat.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};
