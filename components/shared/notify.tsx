import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "hugeicons-proxy";

interface CompProps {
  type: "success" | "info" | "warning" | "error" | "loading";
  title?: string;
  description?: string;
}

export const Notify: React.FC<CompProps> = (props) => {
  const renderIcon = () => {
    switch (props.type) {
      case "success":
        return <Icons.CheckmarkSquare03Icon className="size-5" />;
      case "info":
        return <Icons.AlertSquareIcon className="size-5" />;
      case "warning":
        return <Icons.Alert02Icon className="size-5" />;
      case "error":
        return <Icons.CancelSquareIcon className="size-5" />;
      case "loading":
        return <Icons.Loading03Icon className="size-5 animate-spin" />;
      default:
        break;
    }
  };

  const colorMap: Record<CompProps["type"], string> = {
    success: "text-green-600",
    info: "text-blue-600",
    warning: "text-yellow-600",
    error: "text-red-600",
    loading: "text-foreground",
  };

  return (
    <div className="bg-card flex w-[360px] items-start gap-2.5 rounded-md border p-3 shadow-xs">
      <span className={cn("shrink-0", colorMap[props.type])}>
        {renderIcon()}
      </span>
      <div className="flex flex-col gap-1.5 pt-[3px]">
        {props.title && (
          <p className="text-sm leading-none font-medium">{props.title}</p>
        )}
        {props.description && (
          <p className="text-muted-foreground text-xs">{props.description}</p>
        )}
      </div>
    </div>
  );
};
