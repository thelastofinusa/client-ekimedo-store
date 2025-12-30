import React from "react";
import { Header } from "@/components/shared/header";

export default function CategoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <Header />
      {children}
    </React.Fragment>
  );
}
