
import { Separator } from "@/components/ui/separator";

interface PlanSummaryProps {
  name: string;
  price: number;
  interval?: string;
  features?: string[];
}

export function PlanSummary({ name, price, interval = "month", features = [] }: PlanSummaryProps) {
  return (
    <div className="bg-background/50 backdrop-blur-sm p-4 rounded-md border border-accent/20 shimmer-effect">
      <div className="flex justify-between items-center">
        <span className="font-medium">{name}</span>
        <span className="font-bold text-primary">${price}/{interval}</span>
      </div>
      {features.length > 0 && (
        <div className="mt-2 space-y-1">
          <Separator className="my-2 bg-accent/30" />
          <ul className="text-xs text-muted-foreground list-disc ml-4 space-y-1">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
