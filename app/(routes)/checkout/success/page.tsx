
import { Container } from "@/components/shared/container";
import { SuccessClient } from "./_components/success-client";
import { Suspense } from "react";

export default function SuccessPage() {
  return (
    <div className="flex-1 py-24">
      <Container>
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessClient />
        </Suspense>
      </Container>
    </div>
  );
}
