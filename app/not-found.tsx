import Link from "next/link";
import { Icons } from "hugeicons-proxy";

import { buttonVariants } from "@/ui/button";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { Container } from "@/components/shared/container";

export default function NotFound() {
  return (
    <main className="bg-foreground text-background flex min-h-screen flex-col">
      <Header />
      <div className="py-24 lg:py-32">
        <Container>
          <div className="flex grow flex-col items-center justify-center pt-16 text-center">
            <span className="mb-6 block text-[10px] tracking-[0.5em] uppercase opacity-40">
              Error 404
            </span>
            <h1 className="mb-10 text-5xl tracking-tighter md:text-6xl lg:text-8xl">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mb-10 max-w-md text-sm text-balance">
              The requested couture experience is currently unavailable or has
              been moved to our archives.
            </p>
            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                size: "xl",
                className: "group hover:text-background",
              })}
            >
              <span>Return to Maison</span>
              <Icons.ArrowRight01Icon className="h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
