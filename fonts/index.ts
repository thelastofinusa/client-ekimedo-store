import { cn } from "@/lib/utils";
import localFont from "next/font/local";

const soraSerif = localFont({
  variable: "--font-serif",
  src: [{ path: "./Sora/Sora-VariableFont_wght.ttf" }],
});

const tenorSans = localFont({
  variable: "--font-sans",
  src: [{ path: "./TenorSans/TenorSans-Regular.ttf" }],
});

export const fontVariables = (className: string) =>
  cn(className, soraSerif.variable, tenorSans.variable);
