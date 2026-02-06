import { siteConfig } from "@/site.config";
import { env } from "../env";

export const headerRoutes = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Custom Order",
    path: "/custom-order",
  },
  {
    label: "Pre-made Dresses",
    path: "/shop",
  },
  {
    label: "Pricing",
    path: "/pricing",
  },
  {
    label: "Consultation",
    path: "/consultation",
  },
  {
    label: "Let's Talk",
    path: "/contact",
  },
];

export const footerRoutes = [
  {
    title: "Maison",
    routes: [
      {
        label: "About Us",
        path: "/about",
      },
      {
        label: "Our Gallery",
        path: "/gallery",
      },
      {
        label: "Consultation",
        path: "/consultation",
      },
      {
        label: "Clients Review",
        path: "/testimonials",
      },
      {
        label: "Let's Talk",
        path: "/contact",
      },
    ],
  },
  {
    title: "Inquiries",
    routes: [
      {
        label: `${siteConfig.title} <${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}>`,
        path: `mailto:${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}`,
        newTab: true,
      },
      {
        label: "202-907-4865",
        path: "tel:202-907-4865",
        newTab: true,
      },
      {
        label: "Capitol Heights, Maryland",
        path: "https://maps.app.goo.gl/8d2LfPehk2PMqN5Q8",
        newTab: true,
      },
    ],
  },
];
