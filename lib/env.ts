import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3000),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url("NEXT_PUBLIC_SITE_URL is not a valid URL"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  isServer: typeof window === "undefined",
});
