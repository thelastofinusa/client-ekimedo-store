import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";

import { Toaster } from "@/ui/sonner";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
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
      <Header />
      <main className="flex-1">{props.children}</main>
      <Footer />
    </ThemeProvider>
  );
}
