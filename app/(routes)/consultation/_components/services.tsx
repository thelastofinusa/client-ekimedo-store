"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/ui/button";
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
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service._id}
                href={`/consultation/${service.slug}`}
                className="group flex h-full flex-col"
              >
                {/* Service Image - Large & Beautiful */}
                <div className="bg-secondary/5 relative mb-6 aspect-[1.2] overflow-hidden md:mb-8">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title!}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="from-charcoal/20 absolute inset-0 bg-linear-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                {/* Service Content */}
                <div className="flex flex-1 flex-col space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl leading-tight md:text-3xl">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed opacity-70 md:text-base">
                      {service.description}
                    </p>
                  </div>

                  {/* Highlight Stats */}
                  <div className="border-border/50 flex justify-between gap-8 border-y py-6">
                    <div className="flex flex-col items-start">
                      <p className="mb-1 font-mono text-[10px] tracking-[0.3em] uppercase">
                        Investment
                      </p>
                      <p className="text-2xl font-medium">
                        {formatPrice(service.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="mb-1 font-mono text-[10px] tracking-[0.3em] uppercase">
                        Duration
                      </p>
                      <p className="text-lg font-medium">
                        {formatDuration(service.duration)}
                      </p>
                    </div>
                  </div>

                  {/* Includes - Refined List */}
                  {service?.includes && service.includes.length > 0 && (
                    <div className="flex-1 space-y-3">
                      <p className="mb-2 font-mono text-[10px] tracking-[0.3em] uppercase">
                        Includes
                      </p>
                      <ul className="flex flex-col gap-2">
                        {service.includes.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm opacity-80"
                          >
                            <span className="text-charcoal/40">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button asChild size="xl" className="mt-4">
                    <div>
                      Book Consultation
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                      />
                    </div>
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
};
