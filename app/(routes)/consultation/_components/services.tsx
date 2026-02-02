"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { Button, buttonVariants } from "@/ui/button";
import { Container } from "@/components/shared/container";
import { SERVICE_QUERYResult } from "@/sanity.types";
import { formatPrice, formatDuration } from "@/lib/utils";

interface Props {
  services: SERVICE_QUERYResult;
  messageType?: "success" | "canceled" | null;
}

export const Services: React.FC<Props> = ({ services, messageType }) => {
  const router = useRouter();

  useEffect(() => {
    if (messageType) {
      const t = setTimeout(() => {
        router.replace("/consultation", { scroll: false });
      }, 8000);
      return () => clearTimeout(t);
    }
  }, [messageType, router]);

  return (
    <>
      {messageType === "success" && (
        <Container className="pt-8">
          <div
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200"
            role="alert"
          >
            <p className="font-medium">
              Your consultation has been booked. We&apos;ll be in touch.
            </p>
          </div>
        </Container>
      )}
      {messageType === "canceled" && (
        <Container className="pt-8">
          <div
            className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
            role="alert"
          >
            <p className="font-medium">
              Payment was canceled. You can book again when you&apos;re ready.
            </p>
          </div>
        </Container>
      )}
      <div className="py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 md:gap-16 lg:gap-24">
            {services.map((service) => (
              <div
                key={service._id}
                className="flex flex-col items-center justify-start gap-4 md:gap-6 lg:flex-row lg:gap-8 lg:even:flex-row-reverse xl:gap-10"
              >
                <div className="relative aspect-[1.3] w-full flex-1">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title || "Service title"}
                    fill
                    priority
                    quality={100}
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-4 md:gap-6">
                  <p className="text-muted-foreground flex items-center gap-2 font-mono text-sm sm:text-base">
                    <span>{formatDuration(service.duration)}</span>
                    <span>•</span>
                    <span>{formatPrice(service.price)}</span>
                  </p>

                  <div className="flex flex-col gap-2 md:gap-3">
                    <h3 className="font-serif text-2xl leading-tight font-medium md:text-3xl">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed opacity-70 md:text-base">
                      {service.description}
                    </p>
                  </div>

                  {service?.includes && service.includes.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <p className="font-serif text-sm">
                        What&apos;s Included:
                      </p>

                      <ul className="flex flex-col gap-2">
                        {service.includes.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm opacity-80 sm:text-base"
                          >
                            <span>✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    href={`/consultation/${service.slug}`}
                    className={buttonVariants({
                      size: "lg",
                      className: "mt-4 w-max",
                    })}
                  >
                    <span>Book This Service</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
};
