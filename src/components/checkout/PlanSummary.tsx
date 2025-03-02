
import { Separator } from "@/components/ui/separator";

interface PlanSummaryProps {
  name: string;
  price: number;
  interval?: string;
  features?: string[];
  tierBenefits?: {
    scheduled: number | string;
    monitoring: number | string;
    retention: number | string;
    bulkExport: boolean;
    legalResources: boolean;
    contentProtection: boolean;
    prioritySearch: boolean;
  };
}

export function PlanSummary({ 
  name, 
  price, 
  interval = "month", 
  features = [],
  tierBenefits
}: PlanSummaryProps) {
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
      
      {tierBenefits && (
        <div className="mt-3">
          <Separator className="my-2 bg-accent/30" />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-muted-foreground">Scheduled searches:</div>
            <div className="font-medium">{tierBenefits.scheduled}</div>
            
            <div className="text-muted-foreground">Monitoring limit:</div>
            <div className="font-medium">{tierBenefits.monitoring}</div>
            
            <div className="text-muted-foreground">Data retention:</div>
            <div className="font-medium">{tierBenefits.retention} days</div>
            
            <div className="text-muted-foreground">Bulk export:</div>
            <div className="font-medium">{tierBenefits.bulkExport ? "Yes" : "No"}</div>
            
            <div className="text-muted-foreground">Legal resources:</div>
            <div className="font-medium">{tierBenefits.legalResources ? "Yes" : "No"}</div>
            
            <div className="text-muted-foreground">Content protection:</div>
            <div className="font-medium">{tierBenefits.contentProtection ? "Yes" : "No"}</div>
            
            <div className="text-muted-foreground">Priority search:</div>
            <div className="font-medium">{tierBenefits.prioritySearch ? "Yes" : "No"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
