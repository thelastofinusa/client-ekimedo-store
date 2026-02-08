import type { Metadata } from "next";

import { siteConfig } from "@/site.config";
import { CTA } from "@/components/shared/cta";
import { Container, containerVariants } from "@/components/shared/container";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.title}, a luxury couture maison crafting timeless bridal, prom, and special-event designs with meticulous artistry.`,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "About Us",
    siteName: siteConfig.title,
    description: `Learn about ${siteConfig.title}, a luxury couture maison crafting timeless bridal, prom, and special-event designs with meticulous artistry.`,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us",
    description: `Learn about ${siteConfig.title}, a luxury couture maison crafting timeless bridal, prom, and special-event designs with meticulous artistry.`,
    images: ["/twitter-image.png"],
  },
};

export default function About() {
  return (
    <div className="flex-1 overflow-x-clip">
      <div className="py-24 lg:py-32">
        <Container>
          <header className="py-24 text-center md:text-left">
            <h1 className="font-serif text-5xl leading-none tracking-tighter uppercase md:text-[12vw] md:leading-[0.9] lg:text-[8vw]">
              About <br />
              <span className="italic md:ml-[10vw] lg:ml-[12vw]">
                {siteConfig.title}
              </span>
            </h1>
          </header>

          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-24">
            <div className="space-y-12 lg:col-span-5">
              <div className="bg-secondary relative aspect-4/5 overflow-hidden shadow-xs">
                <Image
                  src="https://images.unsplash.com/photo-1548313093-370cf4ba3892?q=80&w=1364&auto=format&fit=crop"
                  alt="Atelier detail"
                  fill
                  priority
                  quality={100}
                  className="origin-bottom object-cover grayscale transition-transform duration-700 hover:scale-105"
                />
              </div>
              <p className="max-w-md font-serif text-xl leading-relaxed md:text-2xl">
                Crafted for the Bride Who Becomes
              </p>
            </div>

            <div className="space-y-16 lg:col-span-7">
              <div className="flex flex-col items-start gap-12 md:flex-row">
                <div className="pt-4 md:w-1/3">
                  <span className="text-muted-foreground text-[10px] tracking-[0.4em] uppercase">
                    The Genesis
                  </span>
                </div>
                <div className="space-y-8 text-lg leading-relaxed opacity-90 md:w-2/3 md:text-xl">
                  <p>
                    At 22, {siteConfig.title} picked up her first needle. What
                    started as practice became purpose.
                  </p>
                  <p>
                    {siteConfig.title} was born from a love for detail,
                    movement, and quiet elegance. Not just gowns but moments
                    made to last.
                  </p>
                </div>
              </div>
              <div className="bg-secondary relative h-[400px] overflow-hidden shadow-xs md:h-[600px]">
                <Image
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop"
                  alt="Craftsmanship"
                  fill
                  priority
                  quality={100}
                  className="origin-bottom-right object-cover brightness-90 transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-foreground text-background py-24 lg:py-32">
        <Container size="sm">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            <h2 className="font-sans text-4xl font-medium">
              Designed with purpose. <br /> Made to endure.
            </h2>
            <div className="space-y-6">
              <p>
                At {siteConfig.title}, we create pieces that transcend trends.
                Our work is guided by craftsmanship, proportion, and an
                understanding of how clothing moves with the body.
              </p>
              <p>
                From bespoke commissions to limited collections, each garment is
                produced with intention — refined silhouettes, considered
                details, and fabrics chosen for both beauty and longevity.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-secondary py-24 lg:py-32">
        <Container>
          <div className="flex flex-col gap-8 md:gap-12">
            <Image
              className="rounded-(--radius) grayscale"
              src="https://images.unsplash.com/photo-1530099486328-e021101a494a?q=80&w=2747&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="team image"
              height={960}
              width={1420}
              loading="lazy"
            />

            <div
              className={containerVariants({
                className: "grid gap-6 px-0! md:grid-cols-2 md:gap-12",
                size: "sm",
              })}
            >
              <h2 className="font-sans text-4xl font-medium">
                A modern atelier grounded in craftsmanship.
              </h2>
              <div className="space-y-6">
                <p>
                  Every design begins in the atelier, where ideas are shaped
                  through pattern, fabric, and hand-finished detail. We value
                  process as much as outcome, taking the time to get each piece
                  right.
                </p>

                <Link href="/contact" className={buttonVariants()}>
                  <span>Let&apos;s Talk</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-foreground text-background py-24 text-center lg:py-32">
        <Container size="xs">
          <blockquote className="mb-10 font-serif text-3xl leading-tight italic md:text-5xl lg:text-6xl">
            &quot;We don&apos;t just make dresses; we craft the artifacts of
            your life&apos;s most beautiful stories.&quot;
          </blockquote>
          <p className="font-mono text-xs tracking-[0.4em] uppercase">
            — {siteConfig.title}
          </p>
        </Container>
      </div>

      <CTA
        mode="light"
        title="Create With Us"
        description="From bespoke commissions to custom fittings, we collaborate closely to bring considered designs to life."
        route={{
          txt: "Book a Consultation",
          path: "/consultation",
        }}
      />
    </div>
  );
}
