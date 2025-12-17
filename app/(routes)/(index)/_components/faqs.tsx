import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { Container } from "@/components/shared/container";
import { FAQS_CONTENT } from "@/constants";

export const FAQs = () => {
  return (
    <div className="py-16 md:py-24 lg:py-32">
      <Container size="sm">
        <div className="flex flex-col items-center gap-8 text-center md:gap-10 lg:gap-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-3xl font-medium lg:text-4xl">
              Frequently Asked Questions
            </h3>
            <p className="max-w-xl text-sm font-medium sm:text-base md:text-lg">
              Discover quick and comprehensive answers to common questions about
              our platform, services, and features.
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="sm:bg-card sm:ring-muted w-full max-w-2xl sm:rounded-2xl sm:border sm:px-6 sm:py-3 sm:shadow-sm sm:ring-4 md:px-8 dark:ring-0"
            defaultValue="item-3"
          >
            {FAQS_CONTENT.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx + 1}`}
                className="border-dashed"
              >
                <AccordionTrigger>{faq.title}</AccordionTrigger>
                <AccordionContent className="bg-card mb-4 flex flex-col gap-2 rounded-xl p-5 text-left font-serif text-balance sm:mb-0 sm:p-0">
                  <pre className="font-serif font-normal whitespace-pre-wrap">
                    {faq.content}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </div>
  );
};
