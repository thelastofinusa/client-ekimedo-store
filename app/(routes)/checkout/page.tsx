import * as React from "react";
import { CheckoutItems } from "./_components/checkout-items";
import { Container } from "@/components/shared/container";

export default function CheckoutPage() {
  return (
    <div className="py-28 lg:py-36">
      <Container size="sm">
        <CheckoutItems />
      </Container>
    </div>
  );
}
