"use client";
import React from "react";
import { env } from "@/lib/env";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Route } from "next";
import { buttonVariants } from "@/ui/button";
import { Icons } from "hugeicons-proxy";

export const AdminButton = () => {
  const { user } = useUser();
  const isAdmin =
    user?.primaryEmailAddress?.emailAddress ===
    env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL;

  if (!isAdmin) return null;

  return (
    <Link
      href={"/admin" as Route}
      target="_blank"
      className={buttonVariants({
        size: "icon-lg",
        variant: "primary",
        className:
          "fixed right-4 bottom-4 z-40 hidden! md:inline-flex! lg:right-6 lg:bottom-6",
      })}
    >
      <Icons.DashboardSquareEditIcon className="size-5" />
    </Link>
  );
};
