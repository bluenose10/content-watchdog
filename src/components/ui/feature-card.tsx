
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
  style,
}: FeatureCardProps) {
  return (
    <Card className={cn("feature-card glass-card overflow-hidden transition-all duration-300 hover:shadow-lg w-full", className)} style={style}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start gap-3 md:gap-4">
          {icon && (
            <div className="rounded-full bg-primary/10 p-1.5 md:p-2 text-primary flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <div>
              <h4 className="font-semibold text-sm md:text-base">{title}</h4>
              <p className="text-xs md:text-sm text-muted-foreground whitespace-pre-line mt-1">{description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
