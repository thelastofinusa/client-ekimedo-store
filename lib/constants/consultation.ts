import { Icons } from "hugeicons-proxy";

export const preMadeDrConData = {
  _id: "4b9e8005-7727-40ab-bcee-9ab3eb4a6609",
  title: "Pre-made Dresses Try On",
  slug: "try-on",
  description:
    "Visit our atelier to try on our curated selection of ready-to-wear gowns. Our stylists will help you find the perfect fit for your special occasion.",
  duration: 30,
  price: 100,
  image: "/collections/pre-made-dresses.avif",
  includes: [
    "Personal styling consultation with an in-house stylist",
    "Access to a curated selection of ready-to-wear gowns",
    "Guided fitting to find the best size and silhouette",
    "Basic alterations advice (length, fit, adjustments)",
  ],
} as const;

export const consultationsData = [
  {
    _id: "4b9e8005-7727-40ab-bcee-9ab3eb4a6609",
    title: "Bridal Consultation",
    slug: "bridal",
    description:
      "Work with our design team to create your perfect custom bridal gown. Includes 3 design consultations, fabric selection, and unlimited alterations.",
    duration: 60,
    price: 150,
    image: "/collections/bridal.avif",
    includes: [
      "3 design consultations",
      "Fabric & embellishment selection",
      "Unlimited alterations",
      "2-piece initial sketches",
    ],
  },
  {
    _id: "a2d1c9c0-6c92-4b7e-9a3b-2f8f0f1c1234",
    title: "Prom Consultation",
    slug: "prom",
    description:
      "Design a standout prom dress tailored to your style, body type, and event theme. Perfect for making a bold statement.",
    duration: 45,
    price: 250,
    image: "/collections/prom.avif",
    includes: [
      "1-on-1 styling consultation",
      "Custom design discussion",
      "Fabric & color selection",
      "Fit guidance and sizing",
    ],
  },
  {
    _id: "e9f5b61a-1e87-4b23-91b1-7c9d3a567890",
    title: "Special Events Consultation",
    slug: "special-events",
    description:
      "Perfect for galas, birthdays, dinners, and red-carpet moments. Create a refined or statement look tailored to your occasion.",
    duration: 45,
    price: 99.9,
    image: "/collections/special-events.avif",
    includes: [
      "Personal styling consultation",
      "Occasion-based design guidance",
      "Fabric & silhouette selection",
      "Styling and fit recommendations",
    ],
  },
  preMadeDrConData,
] as const;

export const bookingLocation = [
  {
    value: "virtual",
    label: "Virtual (Zoom/Google Meet)",
  },
  { value: "in-person", label: "In-Person (Showroom)" },
];

export const preferredPaymentMethod = [
  {
    id: "stripe",
    label: "Stripe",
    icon: Icons.StripeIcon,
    description: "Fast, secure card payment.",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: Icons.PaypalIcon,
    description: "Quick checkout with PayPal.",
  },
];

export const sizeFilters = [
  { name: "0-2 (XS)", value: "0-2 (XS)" },
  { name: "4-6 (S)", value: "4-6 (S)" },
  { name: "8-10 (M)", value: "8-10 (M)" },
  { name: "12-14 (L)", value: "12-14 (L)" },
  { name: "16-18 (XL)", value: "16-18 (XL)" },
];
