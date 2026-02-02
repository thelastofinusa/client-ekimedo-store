import { Container } from "@/components/shared/container";
import Link from "next/link";
import { buttonVariants } from "@/ui/button";
import { ArrowRight } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { SERVICE_QUERY } from "@/sanity/queries/service";
import { FilteredResponseQueryOptions } from "@sanity/client/stega";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";

export const ServicesComp = async () => {
  const options: FilteredResponseQueryOptions = { next: { revalidate: 30 } };
  const services = await client.fetch(SERVICE_QUERY, {}, options);

  if (!services.length) return null;

  return (
    <div className="bg-foreground text-background py-24 lg:py-32">
      <Container size="sm">
        <div className="flex flex-col gap-6 sm:gap-10 md:flex-row md:gap-16 lg:gap-20">
          <div className="flex flex-col gap-2 md:w-1/3">
            <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
              Personal Styling
            </span>
            <h4 className="">Our Services</h4>
            <p className="mt-4 text-sm leading-relaxed opacity-60">
              Beyond the garment, we provide a holistic experience of luxury,
              ensuring every interaction with EKIMEDO is as refined as our
              collection.
            </p>
          </div>

          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full">
              {services.map((service, idx) => (
                <AccordionItem
                  key={service._id}
                  value={service._id}
                  className="border-border/20 border-b py-4 first-of-type:pt-0 last-of-type:pb-0"
                >
                  <AccordionTrigger className="group hover:no-underline">
                    <div className="flex items-center gap-4 text-left md:gap-6 lg:gap-8">
                      <span className="text-muted-foreground font-mono text-sm tracking-tighter">
                        {idx > 9 ? `${idx + 1}` : `0${idx + 1}`}
                      </span>
                      <span className="font-serif text-xl tracking-tight uppercase transition-all group-hover:italic md:text-2xl lg:text-3xl">
                        {service.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="max-w-xl pb-4 text-sm leading-relaxed opacity-60 sm:pb-6 md:pb-8">
                    {service.description}
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
