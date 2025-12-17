import type { Metadata } from "next";

import "./globals.css";
import { env } from "@/lib/env";
import { fontVariables } from "@/fonts";
import { siteConfig } from "@/config/site.config";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.title} | Bespoke Luxury Fashion`,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.title }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.title} | Bespoke Luxury Fashion`,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        alt: "Ekie22 Fashion Luxury Bridal Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.title} | Bespoke Luxury Fashion`,
    description: siteConfig.description,
    images: [`${siteConfig.url}/twitter-image.jpg`],
  },
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

export default function RootLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontVariables("font-sans antialiased")}>
        {props.children}
      </body>
    </html>
  );
}
