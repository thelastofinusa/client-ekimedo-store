import React from "react";
import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

type LogoVariant = "horizontal" | "wordmark" | "vertical";
type LogoColor = "charcoal" | "bone";

interface LogoProps {
  className?: string;
  href?: string;
  srcDesktop?: LogoVariant;
  srcMobile?: LogoVariant;
  color?: LogoColor;
  desktopSize?: [number, number];
  mobileSize?: [number, number];
}

const getLogoSrc = (variant: LogoVariant | undefined, color: LogoColor) =>
  variant ? `/logo/logo-${variant}-${color}.svg` : `/logo/logo-${color}.svg`;

export const Logo: React.FC<LogoProps> = ({
  color = "charcoal",
  desktopSize = [120, 42],
  mobileSize = [40, 40],
  ...props
}) => {
  const Wrapper = props.href ? Link : "div";

  return (
    <Wrapper
      href={{ pathname: props.href ?? "/" }}
      className={cn("inline-flex items-center", props.className)}
    >
      <Image
        src={getLogoSrc(props.srcDesktop, color)}
        alt={siteConfig.title}
        width={desktopSize[0]}
        height={desktopSize[1]}
        className="hidden h-auto md:block"
        priority
        quality={100}
      />

      <Image
        src={getLogoSrc(props.srcMobile, color)}
        alt={siteConfig.title}
        width={mobileSize[0]}
        height={mobileSize[1]}
        className="block h-auto md:hidden"
        priority
        quality={100}
      />
    </Wrapper>
  );
};
