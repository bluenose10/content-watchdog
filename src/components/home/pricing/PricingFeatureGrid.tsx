
import { Separator } from "@/components/ui/separator";
import { PlanButton } from "./PlanButton";

export function PricingFeatureGrid() {
  return (
    <div className="mb-10 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 text-center gap-4 text-sm">
        <div className="border-b md:border-b-0 md:border-r border-accent/30 pb-2 md:pb-0">
          <span className="font-medium">Feature Comparison</span>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-accent/30 pb-2 md:pb-0">
          <span className="font-medium">Basic</span>
          <div className="text-xs text-muted-foreground">Free</div>
        </div>
        <div className="border-b md:border-b-0 md:border-r border-accent/30 pb-2 md:pb-0">
          <span className="font-medium">Professional</span>
          <div className="text-xs text-muted-foreground">$19.99/month</div>
        </div>
        <div>
          <span className="font-medium">Business</span>
          <div className="text-xs text-muted-foreground">$49.99/month</div>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <FeatureRow 
          feature="Content searches" 
          values={["5 per month", "50 per month", "Unlimited"]} 
        />
        
        <FeatureRow 
          feature="Results per search" 
          values={["5 max", "Unlimited", "Unlimited"]} 
        />
        
        <FeatureRow 
          feature="Scheduled searches" 
          values={["None", "10 saved searches", "Unlimited"]} 
        />
        
        <FeatureRow 
          feature="Content monitoring" 
          values={["None", "20 URLs", "Unlimited URLs"]} 
        />
        
        <FeatureRow 
          feature="Search history retention" 
          values={["7 days", "90 days", "Unlimited"]} 
        />
        
        <FeatureRow 
          feature="Bulk export" 
          values={["No", "Yes (limited)", "Yes (unlimited)"]} 
        />
        
        <FeatureRow 
          feature="Legal resources" 
          values={["No", "Basic templates", "Full access"]} 
        />
        
        <FeatureRow 
          feature="Content protection tools" 
          values={["No", "Yes", "Yes (advanced)"]} 
        />
        
        <FeatureRow 
          feature="Priority search" 
          values={["No", "No", "Yes"]} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div></div>
        <div>
          <PlanButton 
            planId="basic" 
            variant="outline" 
            label="Sign Up Free"
          />
        </div>
        <div>
          <PlanButton 
            planId="pro" 
            variant="secondary" 
            label="Get Professional"
          />
        </div>
        <div>
          <PlanButton 
            planId="business" 
            variant="default" 
            label="Get Business"
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureRowProps {
  feature: string;
  values: string[];
}

function FeatureRow({ feature, values }: FeatureRowProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 text-sm items-center">
        <div className="font-medium">{feature}</div>
        {values.map((value, index) => (
          <div key={index}>{value}</div>
        ))}
      </div>
      <Separator className="my-2" />
    </>
  );
}
