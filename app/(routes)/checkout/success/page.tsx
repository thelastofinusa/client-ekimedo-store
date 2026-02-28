import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  getCheckoutSession,
  getOrderByPaymentIntent,
} from "@/lib/services/checkout";

import { siteConfig } from "@/site.config";
import { SuccessCard } from "../_components/success-card";

export const metadata = {
  title: "Order Confirmed",
  description: "Your order has been placed successfully",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Order Confirmed",
    siteName: siteConfig.title,
    description: "Your order has been placed successfully",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Confirmed",
    description: "Your order has been placed successfully",
    images: ["/twitter-image.png"],
  },
};

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
    payment_intent?: string;
    payment_intent_client_secret?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const paymentIntentId = params.payment_intent;

  const { userId } = await auth();
  if (!userId) return redirect("/");

  if (!sessionId && !paymentIntentId) return redirect("/");

  let result;

  if (sessionId) {
    result = await getCheckoutSession(sessionId, userId);
  } else if (paymentIntentId) {
    result = await getOrderByPaymentIntent(paymentIntentId, userId);
  } else {
    return redirect("/");
  }

  if (!result.success || !result.session) return redirect("/");

  return (
    <div className="flex-1 overflow-x-clip">
      <div className="py-24 lg:py-32">
        <SuccessCard session={result.session} />
      </div>
    </div>
  );
}
