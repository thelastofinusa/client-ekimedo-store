"use client";
import * as React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Button } from "@/ui/button";

interface Props {
  children: React.ReactNode;
}

export const SigninDialog: React.FC<Props> = ({ children }) => {
  return (
    <SignIn.Root>
      <SignIn.Step name="start">
        <Dialog>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Sign in to your account</DialogTitle>
              <DialogDescription>
                Welcome back! Please sign in to continue
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 mt-2">
              <Clerk.Connection name="google" asChild>
                <Button variant="outline" className="w-full gap-3" size="lg">
                  <FcGoogle className="size-4.5" />
                  <span>Sign in with Google</span>
                </Button>
              </Clerk.Connection>

              <Clerk.Connection name="apple" asChild>
                <Button variant="default" className="w-full" size="lg">
                  <FaApple className="size-4.5" />
                  <span>Sign in with Apple</span>
                </Button>
              </Clerk.Connection>
            </div>

            <Clerk.GlobalError className="block text-sm text-red-400" />
          </DialogContent>
        </Dialog>
      </SignIn.Step>
    </SignIn.Root>
  );
};
