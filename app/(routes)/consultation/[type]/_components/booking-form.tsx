import React from "react";

import { PromForm } from "./forms/prom-form";
import { BridalForm } from "./forms/bridal-form";
import { Container } from "@/components/shared/container";
import { SpecialEventForm } from "./forms/special-event-form";
import { consultationsData } from "@/lib/constants/consultation";

interface Props {
  config: (typeof consultationsData)[number];
  type: (typeof consultationsData)[number]["slug"];
}

export const BookingForm: React.FC<Props> = ({ config, type }) => {
  const renderForm = () => {
    switch (type) {
      case "bridal":
        return <BridalForm config={config} />;
      case "prom":
        return <PromForm config={config} />;
      case "special-events":
        return <SpecialEventForm config={config} />;
      default:
        return null;
    }
  };

  return (
    <div className="from-secondary/80 via-secondary/30 to-background bg-linear-to-b py-24 lg:py-32">
      <Container size="default">{renderForm()}</Container>
    </div>
  );
};
