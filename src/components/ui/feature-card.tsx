
import { cn } from "@/lib/utils";
import React from "react";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
