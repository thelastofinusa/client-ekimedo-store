"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Container } from "@/components/shared/container";
import { ConsultationDataType } from "@/lib/constants/consultation";
import { ConsultationCard } from "@/components/shared/consultation-card";

export const Services: React.FC<{
  services: ConsultationDataType;
  messageType?: "success" | "canceled" | null;
}> = ({ services, messageType }) => {
  const router = useRouter();

  useEffect(() => {
    if (messageType) {
      const t = setTimeout(() => {
        router.replace("/consultation", { scroll: false });
      }, 12000);
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
            {services
              .filter((item) => item.slug !== "try-on")
              .map((service, index) => (
                <ConsultationCard key={index} data={service} />
              ))}
          </div>
        </Container>
      </div>
    </>
  );
};
