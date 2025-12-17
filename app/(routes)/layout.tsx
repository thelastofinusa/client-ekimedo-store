import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";

import { Toaster } from "@/ui/sonner";
import { ThemeProvider } from "@/components/provider/theme.provider";

export default function RoutesLayout(props: Readonly<React.PropsWithChildren>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Analytics />
      <Toaster richColors />
      <NextTopLoader color="var(--primary)" showSpinner={false} />
      {props.children}
    </ThemeProvider>
  );
}
