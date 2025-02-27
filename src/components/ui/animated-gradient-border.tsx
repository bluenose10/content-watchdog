
import { cn } from "@/lib/utils";
import React from "react";

interface AnimatedGradientBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradientClasses?: string;
  borderWidth?: string;
  animationDuration?: string;
  containerClassName?: string;
}

export function AnimatedGradientBorder({
  children,
  gradientClasses = "from-indigo-500 via-purple-500 to-pink-500",
  borderWidth = "2px",
  animationDuration = "4s",
  containerClassName,
  className,
  ...props
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative rounded-xl", containerClassName)} {...props}>
      <div
        className={cn(
          "absolute inset-0 rounded-xl bg-gradient-to-r",
          gradientClasses
        )}
        style={{
          zIndex: -1,
          margin: `-${borderWidth}`,
          animation: `spin ${animationDuration} linear infinite`,
        }}
      />
      <div
        className={cn(
          "relative h-full rounded-xl bg-background p-4",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
