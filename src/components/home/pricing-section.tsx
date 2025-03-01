
import { PricingCard } from "@/components/ui/pricing-card";
import { PRICING_PLANS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function PricingSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanClick = (planId: string) => {
    if (planId === "basic") {
      if (!user) {
        // Free plan should navigate to signup
        navigate("/signup");
      } else {
        toast({
          title: "Already on Basic Plan",
          description: "You're already using the basic plan features.",
        });
      }
    } else {
      if (!user) {
        toast({
          title: "Sign up required",
          description: "Please sign up first to upgrade to this plan.",
        });
        navigate("/signup");
      } else {
        // Navigate to checkout with plan ID parameter
        navigate(`/checkout?plan_id=${planId}`);
      }
    }
  };

  return (
    <section id="pricing" className="relative overflow-hidden py-6 md:py-4">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-3 text-gradient">Pricing Plans</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs
          </p>
        </div>

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
            <div className="grid grid-cols-1 md:grid-cols-4 text-sm items-center">
              <div className="font-medium">Content searches</div>
              <div>5 per month</div>
              <div>50 per month</div>
              <div>Unlimited</div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 text-sm items-center">
              <div className="font-medium">Results per search</div>
              <div>5 max</div>
              <div>Unlimited</div>
              <div>Unlimited</div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 text-sm items-center">
              <div className="font-medium">Scheduled searches</div>
              <div>None</div>
              <div>10 saved searches</div>
              <div>Unlimited</div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 text-sm items-center">
              <div className="font-medium">Content monitoring</div>
              <div>None</div>
              <div>20 URLs</div>
              <div>Unlimited URLs</div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 text-sm items-center">
              <div className="font-medium">Search history retention</div>
              <div>7 days</div>
              <div>90 days</div>
              <div>Unlimited</div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 text-sm items-center">
              <div className="font-medium">Bulk export</div>
              <div>No</div>
              <div>Yes (limited)</div>
              <div>Yes (unlimited)</div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 text-sm items-center">
              <div className="font-medium">Legal resources</div>
              <div>No</div>
              <div>Basic templates</div>
              <div>Full access</div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 text-sm items-center">
              <div className="font-medium">Content protection tools</div>
              <div>No</div>
              <div>Yes</div>
              <div>Yes (advanced)</div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 text-sm items-center">
              <div className="font-medium">Priority search</div>
              <div>No</div>
              <div>No</div>
              <div>Yes</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div></div>
            <div>
              <Button
                onClick={() => handlePlanClick("basic")}
                variant="outline"
                className="w-full"
              >
                Sign Up Free
              </Button>
            </div>
            <div>
              <Button
                onClick={() => handlePlanClick("pro")}
                variant="secondary"
                className="w-full"
              >
                Get Professional
              </Button>
            </div>
            <div>
              <Button
                onClick={() => handlePlanClick("business")}
                className="w-full"
              >
                Get Business
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-6 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              features={plan.features}
              limitations={[]}
              cta={plan.cta}
              popular={plan.popular}
              onClick={() => handlePlanClick(plan.id)}
              planId={plan.id}
              className="animate-scale-in w-full md:w-1/3"
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            14-day money-back guarantee. No contracts.
          </p>
        </div>
      </div>
    </section>
  );
}
