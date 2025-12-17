import Link from "next/link";

import { buttonVariants } from "@/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="px-4 text-center">
        <h1 className="text-primary mb-6 max-w-3xl font-serif text-6xl font-bold text-balance lg:text-7xl xl:text-8xl">
          404
        </h1>
        <h1 className="mb-2 font-serif text-lg font-medium md:text-xl">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-sm text-sm font-medium sm:text-base">
          Looks like this route doesn&apos;t exist. Please check the URL or go
          back to the home page.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className={buttonVariants({
              size: "lg",
              className: "rounded-full!",
            })}
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
