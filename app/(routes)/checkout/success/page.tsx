import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCheckoutSession, getOrderByPaymentIntent } from "@/lib/services/checkout";
import { SuccessClient } from "../_components/success-card";

export const metadata = {
  title: "Order Confirmed | Furniture Shop",
  description: "Your order has been placed successfully",
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
  if (!userId) redirect("/");

  if (!sessionId && !paymentIntentId) {
    redirect("/");
  }

  let result;

  if (sessionId) {
    result = await getCheckoutSession(sessionId, userId);
  } else if (paymentIntentId) {
    result = await getOrderByPaymentIntent(paymentIntentId, userId);
  } else {
    redirect("/");
  }

  if (!result.success || !result.session) {
    // If order not found or unauthorized, redirect home
    // We could also show an error page here
    redirect("/");
  }

  return <SuccessClient session={result.session} />;
}
