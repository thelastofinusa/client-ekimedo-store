import { Icons } from "hugeicons-proxy";
import { client } from "@/sanity/lib/client";
import { Container } from "@/components/shared/container";
import { formatSanityDate, getInitials } from "@/lib/utils";
import { TESTIMONIAL_QUERY } from "@/sanity/queries/testimonial";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { FilteredResponseQueryOptions } from "@sanity/client/stega";
import Link from "next/link";
import { buttonVariants } from "@/ui/button";
import { ArrowRight } from "lucide-react";

export const TestimonialComp = async () => {
  const options: FilteredResponseQueryOptions = { next: { revalidate: 30 } };
  const testimonials = await client.fetch(TESTIMONIAL_QUERY, {}, options);

  if (!testimonials.length) return null;

  return (
    <div className="bg-foreground text-background py-24 lg:py-32">
      <Container>
        <div className="mb-16 text-center">
          <p className="text-primary-foreground/60 mb-4 text-[11px] tracking-[0.3em] uppercase">
            Testimonials
          </p>
          <h2 className="font-serif text-4xl capitalize md:text-5xl">
            What our clients say
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div
              key={testimonial._id}
              className="bg-primary-foreground/5 border-primary-foreground/10 flex h-max flex-col gap-6 border p-6 shadow-xs"
            >
              <blockquote>
                <p className="text-charcoal/90 text-base leading-[1.7] font-light italic">
                  &quot;{testimonial.review}&quot;
                </p>
              </blockquote>

              {/* Author Profile */}
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="flex items-center gap-2">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name!}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {getInitials(testimonial.name!)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-muted-foreground mt-0.5 text-[11px] font-medium tracking-widest uppercase">
                      {testimonial.date
                        ? formatSanityDate(testimonial.date)
                        : testimonial.category?.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-px">
                  {[...Array(5)].map((_, i) => (
                    <Icons.StarIcon
                      key={i}
                      fill={i < testimonial.rating! ? "currentColor" : "none"}
                      className="text-background size-4"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/testimonials"
            className={buttonVariants({
              size: "lg",
              variant: "secondary",
            })}
          >
            <span>View All Testimonials</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
};
