import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { Syne } from "next/font/google";

const soraFont = Syne({
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800"],
});

const tensorFont = localFont({
  variable: "--font-sans",
  src: [{ path: "./TenorSans/TenorSans-Regular.ttf" }],
});

const spaceGroteskFont = localFont({
  variable: "--font-mono",
  src: [{ path: "./SpaceGrotesk/SpaceGrotesk-VariableFont_wght.ttf" }],
});

export const fontVariables = (className: string) =>
  cn(
    className,
    soraFont.variable,
    tensorFont.variable,
    spaceGroteskFont.variable,
  );
