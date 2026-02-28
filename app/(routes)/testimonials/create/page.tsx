import React from "react";
import { ReviewForm } from "../_components/review-form";
import { HeroComp } from "@/components/shared/hero";

export default function WriteTestimonialPage() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp
        title="Share Your Experience"
        description="Your story matters. Tell us about your experience and how our craftsmanship played a part in your special moment."
      />

      <ReviewForm />
    </div>
  );
}
