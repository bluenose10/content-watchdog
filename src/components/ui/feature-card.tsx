
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
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <div>
              <h4 className="font-semibold">{title}</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
