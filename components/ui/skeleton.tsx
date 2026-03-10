import { cn } from "@/lib/utils";
import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType; // <- Use React.ElementType
}

function Skeleton({
  as: Component = "div",
  className,
  ...props
}: SkeletonProps) {
  return (
    <Component
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
