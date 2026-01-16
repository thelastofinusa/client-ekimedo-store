import Link from "next/link";

import { buttonVariants } from "@/ui/button";
import { Container } from "@/shared/container";

export default function NotFound() {
  return (
    <main className="bg-foreground text-background flex min-h-screen flex-col">
      <div className="py-24 lg:py-32 h-dvh">
        <Container className="flex flex-col justify-center h-full">
          <div className="flex grow flex-col items-center justify-center pt-16 text-center">
            <span className="mb-4 block text-[10px] tracking-[0.5em] uppercase opacity-40">
              Error 404
            </span>
            <h1 className="mb-6 text-5xl tracking-tighter md:text-6xl lg:text-8xl">
              Page Not Found
            </h1>
            <p className="text-muted-foreground mb-10 max-w-md text-sm text-balance">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              href="/"
              className={buttonVariants({
                variant: "outline",
                size: "xl",
                className: "hover:text-background",
              })}
            >
              <span>Return to Home</span>
            </Link>
          </div>
        </Container>
      </div>
    </main>
  );
}
