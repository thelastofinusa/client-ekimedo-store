import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    SANITY_API_WRITE_TOKEN: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    PAYPAL_CLIENT_ID: z.string().min(1),
    PAYPAL_CLIENT_SECRET: z.string().min(1),
    SANITY_WEBHOOK_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url().min(1),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_RESEND_CONTACT_EMAIL: z.email().min(1),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_RESEND_INFO_EMAIL: z.email().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_RESEND_CONTACT_EMAIL:
      process.env.NEXT_PUBLIC_RESEND_CONTACT_EMAIL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_RESEND_INFO_EMAIL: process.env.NEXT_PUBLIC_RESEND_INFO_EMAIL,
  },
});
