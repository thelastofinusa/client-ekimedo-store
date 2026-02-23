import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/ui/button";
import { formatDuration, formatPrice } from "@/lib/utils";
import { consultationsData } from "@/lib/constants/consultation";

export const ServicesComp = async () => {
  return (
    <div className="bg-background">
      <section className="from-secondary via-secondary/50 overflow-x-clip bg-linear-to-b to-transparent py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
            {consultationsData.slice(0, 2).map((service) => (
              <Link
                key={service.slug}
                href={`/consultation/${service.slug}`}
                className="group hover-lift relative aspect-square overflow-hidden md:aspect-auto md:h-[500px]"
              >
                <Image
                  fill
                  priority
                  quality={100}
                  alt={service.title ?? "Service title"}
                  src={service.image ?? "/placeholder.svg"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="from-foreground/80 via-foreground/50 absolute inset-0 bg-linear-to-t to-transparent" />
                <div className="text-primary-foreground absolute right-0 bottom-0 left-0 p-5 md:p-8">
                  <p className="luxury-subheading text-primary-foreground/70 mb-2 text-sm sm:text-base">
                    {formatDuration(service.duration)} •{" "}
                    {formatPrice(service.price)}
                  </p>
                  <h3 className="mb-3 font-serif text-2xl md:text-3xl">
                    {service.title}
                  </h3>
                  <p className="text-primary-foreground/80 mb-4 line-clamp-2 text-sm sm:text-base">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/consultation"
              className={buttonVariants({
                size: "lg",
              })}
            >
              <span>View All Consultations</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};
