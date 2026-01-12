import { Suspense } from "react";
import { Icons } from "hugeicons-proxy";
import { SignInClient } from "./_components/sign-in-client";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Icons.Loading03Icon className="text-muted-foreground size-8 animate-spin" />
        </div>
      }
    >
      <SignInClient />
    </Suspense>
  );
}
