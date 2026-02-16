import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "hugeicons-proxy";

interface CompProps {
  type: "success" | "info" | "warning" | "error" | "loading";
  title?: string;
  description?: string;
}

export const renderToastIcon = (props: CompProps["type"]) => {
  switch (props) {
    case "success":
      return <Icons.CheckmarkSquare03Icon className="size-4.5" />;
    case "info":
      return <Icons.AlertSquareIcon className="size-4.5" />;
    case "warning":
      return <Icons.Alert02Icon className="size-4.5" />;
    case "error":
      return <Icons.CancelSquareIcon className="size-4.5" />;
    case "loading":
      return <Icons.Loading03Icon className="size-4.5 animate-spin" />;
    default:
      break;
  }
};

export const Notify: React.FC<CompProps> = (props) => {
  const colorMap: Record<CompProps["type"], { wrapper: string; icon: string }> =
    {
      success: {
        icon: "text-green-600",
        wrapper: "text-green-600 bg-green-600/10 border-green-600/50",
      },
      info: {
        icon: "text-blue-600",
        wrapper: "text-blue-600 bg-blue-600/10 border-blue-600/50",
      },
      warning: {
        icon: "text-yellow-600",
        wrapper: "text-yellow-600 bg-yellow-600/10 border-yellow-600/50",
      },
      error: {
        icon: "text-red-600",
        wrapper: "text-red-600 bg-red-600/10 border-red-600/50",
      },
      loading: {
        icon: "text-foreground",
        wrapper: "bg-card",
      },
    };

  return (
    <div className="bg-card w-[360px]">
      <div
        className={cn(
          "flex items-start gap-2.5 rounded-md border p-3 shadow-xs",
          colorMap[props.type].wrapper,
        )}
      >
        <span className={cn("shrink-0", colorMap[props.type].icon)}>
          {renderToastIcon(props.type)}
        </span>
        <div className="flex flex-col gap-1 pt-[1.5px]">
          {props.title && (
            <p className="text-sm leading-none font-medium">{props.title}</p>
          )}
          {props.description && (
            <p className="text-[13px] opacity-80">{props.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
