import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/fonts";

export const metadata: Metadata = {
  title: "Ekie Fashion",
  description: "Ekie Fashion is a fashion e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontVariables("antialiased font-sans")}>{children}</body>
    </html>
  );
}
