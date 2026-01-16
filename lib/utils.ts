import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: number | null | undefined,
  currency = "$",
  locale = "en-US",
): string {
  const value = amount ?? 0;

  return `${currency}${value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function isActivePath(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export async function sleep(duration = 1500, name = "Timer"): Promise<void> {
  await new Promise((resolve) => setTimeout(() => resolve({ name }), duration));
}

export function formatSanityDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
