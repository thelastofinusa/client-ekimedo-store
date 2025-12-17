"use client";

import { useTheme } from "next-themes";
import { Icons } from "hugeicons-proxy";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <Icons.CheckmarkSquare03Icon className="size-4" />,
        info: <Icons.AlertSquareIcon className="size-4" />,
        warning: <Icons.Alert02Icon className="size-4" />,
        error: <Icons.CancelSquareIcon className="size-4" />,
        loading: <Icons.Loading03Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
