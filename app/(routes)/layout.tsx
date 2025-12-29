import React from "react";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";

import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <Header />
      <Analytics />
      <NextTopLoader color="var(--primary)" showSpinner={false} />
      <main>{children}</main>
      <Footer />
    </React.Fragment>
  );
}
