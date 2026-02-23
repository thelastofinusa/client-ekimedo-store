"use client";
import React from "react";
import { motion } from "motion/react";
import { Clock, ShieldAlert, DollarSign, UserCheck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Icons } from "hugeicons-proxy";
import { Alert, AlertDescription, AlertTitle } from "@/ui/alert";

const policies = [
  {
    icon: Icons.Dollar01Icon,
    title: "Consultation Credit",
    content:
      "Consultation fees are $250 for Bridal and $150 for Special Events. The entire consultation fee goes towards the final cost of your garment should you choose to proceed.",
  },
  {
    icon: Icons.Time04Icon,
    title: "Rescheduling & No-Shows",
    content:
      "If you cannot make your initial appointment, please notify us at least 24 hours in advance to cancel or reschedule. Failure to provide 24-hour notice will result in the forfeiture of your fee, requiring a new payment for a future session.",
  },
  {
    icon: Icons.Shield01Icon,
    title: "Refund Eligibility",
    content:
      "The consultation fee is strictly non-refundable. If you decide not to move forward with dress production, the fee will not be returned as it covers the expert time and advice provided during your session.",
  },
  {
    icon: Icons.UserCheck01Icon,
    title: "Right of Service",
    content:
      "We reserve the right to refuse business if a working relationship is no longer conducive to our professional standards. In such cases, we will refund any balance after deducting costs for supplies, labor, and time spent on your order.",
  },
];

export default function CancellationPolicy() {
  return (
    <div className="flex-1 overflow-x-clip">
      <div className="bg-foreground relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[url('/consultation.avif')] bg-cover bg-center opacity-20" />
        <Container className="pt-8 md:pt-16" size="sm">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <h1 className="text-background mb-4 max-w-2xl font-serif text-5xl sm:text-6xl md:mb-6">
              Booking & Cancellation
            </h1>
            <p className="text-primary-foreground/60 max-w-[600px]">
              Transparent terms to ensure a seamless experience from your first
              consultation to the final fitting of your custom gown.
            </p>
          </motion.div>
        </Container>
      </div>

      <div className="py-24 lg:py-32">
        <Container size="xs" className="flex flex-col gap-6">
          <div className="bg-card border-border grid h-auto gap-6 overflow-hidden rounded-md border p-6 text-sm shadow-xs md:gap-8 md:p-8 xl:gap-12 xl:p-12">
            {policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex gap-6"
              >
                <div className="bg-primary-foreground text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300">
                  <policy.icon />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-medium tracking-tight">
                    {policy.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {policy.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
