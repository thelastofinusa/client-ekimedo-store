import React from "react";
import { Container } from "@/components/shared/container";
import { ConsultationForm } from "./_components/consultation-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Consultation",
  description:
    "Schedule a private consultation with us to translate your bridal, prom, or special-event vision into a bespoke couture gown.",
};

export default function Consultation() {
  return (
    <div className="py-12 md:py-24">
      <Container size="sm">
        <div className="mb-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-6">
            Private Consultation
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Begin your journey to a custom masterpiece. Schedule a consultation with
            our designers to discuss your vision, measurements, and requirements.
          </p>
        </div>
        
        <div className="bg-card border p-8 md:p-12 shadow-sm rounded-lg">
            <ConsultationForm />
        </div>
      </Container>
    </div>
  );
}
