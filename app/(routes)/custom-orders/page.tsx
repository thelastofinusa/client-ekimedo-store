import React from "react";
import { HeroComp } from "./_components/hero.comp";
import { InquireForm } from "./_components/inquire-form";

export default function CustomOrders() {
  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp />
      <InquireForm />
    </div>
  );
}
