"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/ui/button";
import { Icons } from "hugeicons-proxy";
import { cn } from "@/lib/utils";

export function ModeSwitcher() {
  const [isMounted, setIsMounted] = React.useState(false);
  const { setTheme, resolvedTheme, theme } = useTheme();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = React.useCallback(() => {
    if (!isMounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme, isMounted]);

  const ThemeIcon = isMounted
    ? theme === "dark"
      ? Icons.Sun02Icon
      : Icons.MoonCloudIcon
    : Icons.Loading03Icon;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      title="Toggle theme"
      disabled={!isMounted}
    >
      <ThemeIcon className={cn("size-4", !isMounted && "animate-spin")} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
