import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(duration = 1500, name = "Timer"): Promise<void> {
  await new Promise((resolve) => setTimeout(() => resolve({ name }), duration));
}
