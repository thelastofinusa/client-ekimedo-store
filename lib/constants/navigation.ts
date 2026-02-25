import { env } from "../env";

type Route = {
  label: string;
  path: string;
  newTab?: boolean;
};

type HeaderRoute =
  | (Route & { subroutes?: Route[] })
  | {
      label: string;
      path?: string;
      subroutes: Route[];
    };

export const headerRoutes: HeaderRoute[] = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Pre-made Dresses",
    path: "/shop",
  },
  {
    label: "Inquiry",
    path: "/custom-order",
  },
  {
    label: "Book Consultation",
    path: "/consultation",
  },
  {
    label: "Pricing",
    path: "/pricing",
  },
  {
    label: "Discover",
    subroutes: [
      {
        label: "About Us",
        path: "/about",
      },
      {
        label: "Our Gallery",
        path: "/gallery",
      },
      {
        label: "Testimonials",
        path: "/testimonials",
      },
      {
        label: "Let's Talk",
        path: "/contact",
      },
      {
        label: "Email Preview",
        path: "/email-preview",
      },
    ],
  },
];

const discoverRoute = headerRoutes.find(
  (item): item is { label: string; subroutes: Route[] } => "subroutes" in item,
);

export const footerRoutes = [
  {
    title: "Shop & Services",
    routes: headerRoutes.filter((item): item is Route => "path" in item),
  },
  {
    title: discoverRoute?.label ?? "About the Brand",
    routes: [
      ...(discoverRoute?.subroutes ?? []),
      {
        label: "Cancellation Policy",
        path: "/policies",
      },
    ],
  },
  {
    title: "Get in Touch",
    routes: [
      {
        label: "(+1) 202-907-4865",
        path: `tel:+12029074865`,
        newTab: true,
      },
      {
        label: env.NEXT_PUBLIC_RESEND_INFO_EMAIL,
        path: `mailto:${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}`,
        newTab: true,
      },
      {
        label: "Capitol Heights, MD 20743, USA",
        path: "https://maps.app.goo.gl/GPmSTjbNLuXrPMZ59",
        newTab: true,
      },
    ],
  },
];
