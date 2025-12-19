// components/ui/badge.tsx
import * as React from "react";
import { cn } from "../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" &&
          "bg-emerald-600 text-white",
        variant === "outline" &&
          "border border-emerald-600 text-emerald-700",
        className
      )}
      {...props}
    />
  );
}
