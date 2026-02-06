"use client";

import { useEffect, useState } from "react";
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/ui/button";
import { toast } from "sonner";
import { Notify } from "@/components/shared/notify";
import { env } from "@/lib/env";

// Initialize Stripe
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

interface CheckoutFormProps {
  clientSecret: string;
}

function CheckoutFormContent() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? "An unexpected error occurred.");
      toast.custom(() => (
        <Notify
          type="error"
          title="Payment Failed"
          description={error.message ?? "An unexpected error occurred."}
        />
      ));
    } else {
      setMessage("An unexpected error occurred.");
      toast.custom(() => (
        <Notify
          type="error"
          title="Payment Error"
          description="An unexpected error occurred."
        />
      ));
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <h3 className="mb-4 text-lg font-medium">Shipping Address</h3>
      <AddressElement options={{ mode: "shipping" }} className="mb-6" />

      <h3 className="mb-4 text-lg font-medium">Payment Details</h3>
      <PaymentElement id="payment-element" options={paymentElementOptions} />

      {/* PayPal Support Note:
          PayPal is automatically supported by PaymentElement if enabled in Stripe Dashboard.
          Ensure "PayPal" is enabled in your Stripe Payment Method settings.
      */}

      <div className="mt-6">
        <Button
          id="submit"
          className="w-full"
          size="lg"
          disabled={!stripe || !elements}
          isLoading={isLoading}
          loadingText="Processing..."
        >
          <span id="button-text">Pay Now</span>
        </Button>
      </div>

      {message && (
        <div
          id="payment-message"
          className="mt-4 text-center text-sm text-red-500"
        >
          {message}
        </div>
      )}
    </form>
  );
}

export function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#000000",
      },
    },
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutFormContent />
    </Elements>
  );
}
