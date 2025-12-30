import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { variables } from "@/font";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.title} - ${siteConfig.tagline}`,
    template: `%s - ${siteConfig.title}`,
  },
  description: siteConfig.description,
  metadataBase: siteConfig.url,
  authors: [{ name: siteConfig.title }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.title} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.title} - ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.title} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [`${siteConfig.url}/twitter-image.png`],
  },
  icons: [
    {
      url: "/logo/logo-charcoal.svg",
      media: "(prefers-color-scheme: light)",
    },
    {
      url: "/logo/logo-bone.svg",
      media: "(prefers-color-scheme: dark)",
    },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={variables("antialiased")}>
        <Analytics />
        <NextTopLoader color="var(--primary)" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
