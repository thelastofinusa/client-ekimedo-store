import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { Container } from "@/components/shared/container";

const SERVICES = [
  {
    id: "01",
    title: "Bespoke Couture",
    content:
      "One-of-a-one garments tailored specifically to your measurements and vision. A process that spans multiple fittings and months of dedication.",
  },
  {
    id: "02",
    title: "Bridal Consultation",
    content:
      "Crafting the centerpiece for your most significant day. We guide you through fabric selection, silhouette design, and intricate detailing.",
  },
  {
    id: "03",
    title: "Red Carpet Styling",
    content:
      "From international film festivals to exclusive galas, our styling team ensures your presence is unforgettable and uniquely yours.",
  },
  {
    id: "04",
    title: "Alteration Atelier",
    content:
      "Maintaining the integrity of your heritage pieces with master-level adjustments and restoration services.",
  },
];

export const ServicesComp = () => {
  return (
    <div className="bg-foreground text-background py-24 lg:py-32">
      <Container size="sm">
        <div className="flex flex-col gap-6 sm:gap-10 md:flex-row md:gap-16 lg:gap-20">
          <div className="flex flex-col gap-2 md:w-1/3">
            <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
              Expertise
            </span>
            <h4 className="">Maison Services</h4>
            <p className="mt-4 text-sm leading-relaxed opacity-60">
              Beyond the garment, we provide a holistic experience of luxury,
              ensuring every interaction with EKIMEDO is as refined as our
              collection.
            </p>
          </div>

          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full">
              {SERVICES.map((service) => (
                <AccordionItem
                  key={service.id}
                  value={service.id}
                  className="border-b py-4 first-of-type:pt-0 last-of-type:pb-0"
                >
                  <AccordionTrigger className="group hover:no-underline">
                    <div className="flex items-center gap-4 text-left md:gap-6 lg:gap-8">
                      <span className="text-muted-foreground font-mono text-sm tracking-tighter">
                        {service.id}
                      </span>
                      <span className="font-serif text-xl tracking-tight uppercase transition-all group-hover:italic md:text-2xl lg:text-3xl">
                        {service.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="max-w-xl pb-4 pl-6 text-sm leading-relaxed opacity-60 sm:pb-6 md:pb-8 md:pl-10 lg:pl-14">
                    {service.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </div>
  );
};
