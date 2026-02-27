import { Icons } from "hugeicons-proxy";
import { client } from "@/sanity/lib/client";
import { Container } from "@/components/shared/container";
import { clientOptions, formatDate, getInitials } from "@/lib/utils";
import { TESTIMONIAL_QUERY } from "@/sanity/queries/testimonial";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import Link from "next/link";

export const TestimonialComp = async () => {
  const testimonials = await client.fetch(TESTIMONIAL_QUERY, {}, clientOptions);

  if (!testimonials.length) return null;

  return (
    <div className="bg-foreground text-background py-24 lg:py-32">
      <Container>
        <div className="mb-16 text-center">
          <p className="text-primary-foreground/60 mb-3 text-[11px] tracking-[0.3em] uppercase">
            Testimonials
          </p>
          <h2 className="font-serif text-4xl capitalize md:text-5xl">
            What our clients say
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => {
            const clientName = testimonial.clerkUser?.name || testimonial.name;
            const clientAvatar =
              testimonial.clerkUser?.avatarUrl || testimonial.avatar;

            return (
              <Link
                href="/testimonials"
                key={testimonial._id}
                className="bg-primary-foreground/5 border-primary-foreground/10 flex h-max flex-col gap-6 border p-6 shadow-xs md:last-of-type:col-span-2 lg:last-of-type:col-span-1"
              >
                <blockquote>
                  <p className="text-charcoal/90 text-base leading-[1.7] font-light italic">
                    &quot;{testimonial.review}&quot;
                  </p>
                </blockquote>

                {/* Author Profile */}
                <div className="flex items-center gap-3">
                  <Avatar className="size-11">
                    <AvatarImage
                      src={clientAvatar as string}
                      alt={clientName as string}
                      className="object-cover"
                    />
                    <AvatarFallback>{getInitials(clientName!)}</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-1 gap-4">
                    <div className="flex flex-col">
                      <p className="flex items-center gap-2 text-sm font-medium md:text-base">
                        <span>{clientName}</span>{" "}
                        <span className="flex gap-px">
                          {[...Array(5)].map((_, i) => (
                            <Icons.StarIcon
                              key={i}
                              fill={
                                i < testimonial.rating!
                                  ? "currentColor"
                                  : "none"
                              }
                              className="text-primary size-4"
                            />
                          ))}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs font-medium">
                        {testimonial.service}{" "}
                        {testimonial.date &&
                          `- ${formatDate(testimonial.date)}`}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
};
