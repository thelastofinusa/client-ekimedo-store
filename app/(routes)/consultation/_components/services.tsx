"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/ui/button";
import { Container } from "@/components/shared/container";
import { SERVICE_QUERYResult } from "@/sanity.types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Props {
  services: SERVICE_QUERYResult;
}

export const Services: React.FC<Props> = ({ services }) => {
  return (
    <>
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
                      <p className="text-lg font-medium">{service.duration}</p>
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
