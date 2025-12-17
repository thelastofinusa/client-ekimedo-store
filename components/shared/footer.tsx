import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Separator } from "@/ui/separator";
import { FOOTER_ELEMENTS } from "@/constants";
import { siteConfig } from "@/config/site.config";

export const Footer = () => {
  return (
    <footer className="py-10 sm:py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex w-full flex-col gap-4 md:gap-6">
            <h3 className="text-xl font-semibold">{siteConfig.title}</h3>

            <div className="flex items-center gap-2">
              {FOOTER_ELEMENTS.socials.map((item, idx) => (
                <React.Fragment key={idx}>
                  <Link href={{ pathname: item.href }} className="group">
                    <item.icon className="group-hover:text-primary text-muted-foreground size-7 transition-all duration-300 ease-out sm:size-6" />
                  </Link>
                  {idx < FOOTER_ELEMENTS.socials.length - 1 && (
                    <Separator orientation="horizontal" className="w-2!" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-sm font-medium">{siteConfig.description}</p>
          </div>

          <div className="flex w-full flex-col gap-4 md:gap-6">
            <p className="font-serif text-base font-medium">
              The Design Process
            </p>

            <div className="flex flex-col gap-3">
              {FOOTER_ELEMENTS.designProcess.map((process, idx) => {
                const Comp = process.path ? Link : "p";

                return (
                  <Comp
                    href={{ pathname: process.path }}
                    key={idx}
                    className={cn(
                      "flex items-center gap-2.5 transition-all duration-300 ease-out",
                      process.path && "hover:text-primary hover:underline",
                    )}
                  >
                    <process.icon className="size-4.5" />
                    <span className="flex-1 text-sm">{process.name}</span>
                  </Comp>
                );
              })}
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 md:gap-6">
            <p className="font-serif text-base font-medium">Contact Us</p>

            <div className="flex flex-col gap-3">
              {FOOTER_ELEMENTS.contact.map((contact, idx) => (
                <Link
                  href={{ pathname: contact.href }}
                  key={idx}
                  className="hover:text-primary flex items-center gap-2.5 hover:underline"
                >
                  <contact.icon className="size-4.5" />
                  <span className="flex-1 text-sm">{contact.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 md:gap-6">
            <p className="font-serif text-base font-medium">Business Hours</p>

            <div className="flex flex-col gap-3">
              {FOOTER_ELEMENTS.businessHours.map((hr, idx) => (
                <p
                  key={idx}
                  className="flex items-center justify-between text-sm font-medium"
                >
                  <span>{hr.day}</span>
                  {!hr.open || !hr.close ? (
                    <span>Closed</span>
                  ) : (
                    <span>
                      {hr.open} - {hr.close}
                    </span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
