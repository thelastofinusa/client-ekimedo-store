"use client";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { PiAppleLogoFill } from "react-icons/pi";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

import { Button } from "@/ui/button";

export function SignInClient() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Login Form */}
      <div className="bg-background flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <h2 className="text-foreground font-serif text-3xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Sign in to access your saved items and checkout securely.
            </p>
          </div>

          <div className="mt-10">
            <SignIn.Root>
              <SignIn.Step name="start" className="space-y-6">
                <div className="space-y-4">
                  <Clerk.Connection name="google" asChild>
                    <Button variant="default" size="xl" className="w-full">
                      <FcGoogle />
                      <span>Continue with Google</span>
                    </Button>
                  </Clerk.Connection>
                  <Clerk.Connection name="apple" asChild>
                    <Button variant="outline" size="xl" className="w-full">
                      <PiAppleLogoFill />
                      <span>Continue with Apple</span>
                    </Button>
                  </Clerk.Connection>
                </div>
              </SignIn.Step>
            </SignIn.Root>

            <div className="text-muted-foreground/60 mt-10 text-center text-xs">
              <p>
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative hidden lg:block lg:w-1/2">
        <Image
          className="absolute inset-0 size-full object-cover"
          src="/collections/bridal.avif"
          alt="Fashion editorial"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black/10" /> {/* Subtle overlay */}
        <div className="absolute right-0 bottom-0 left-0 z-10 p-20 text-white">
          <blockquote className="font-serif text-3xl leading-tight font-medium">
            &quot;Elegance is the only beauty that never fades.&quot;
          </blockquote>
          <p className="mt-4 text-sm font-medium opacity-80">
            — Audrey Hepburn
          </p>
        </div>
      </div>
    </div>
  );
}
