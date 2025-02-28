
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/stripe/CheckoutButton";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  price: number;
  features: string[];
  limitations?: string[];
  cta: string;
  popular?: boolean;
  onClick?: () => void;
  planId?: string;
}

export function PricingCard({
  name,
  description,
  price,
  features,
  limitations = [],
  cta,
  popular = false,
  onClick,
  planId,
  className,
  ...props
}: PricingCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Ensure price is properly formatted
  const formattedPrice = price === 0 ? "Free" : `$${price.toFixed(2)}`;

  const handlePlanClick = () => {
    if (!user && planId !== "basic") {
      // Redirect to signup for non-basic plans if not logged in
      navigate("/signup");
      return;
    }
    
    if (onClick) {
      onClick();
    } else if (planId && price > 0) {
      // For paid plans, navigate to checkout page with plan ID
      navigate(`/checkout?plan_id=${planId}`);
    }
  };

  return (
    <div
      className={cn(
        "relative glass-card overflow-hidden rounded-xl p-6 transition-all duration-300",
        "before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-purple-200 before:via-blue-200 before:to-indigo-200 dark:before:from-purple-900/30 dark:before:via-blue-900/30 dark:before:to-indigo-900/30 before:-z-10",
        "after:absolute after:inset-[2px] after:rounded-[calc(0.75rem-2px)] after:bg-white dark:after:bg-gray-900 after:-z-10",
        popular ? "scale-105 shadow-xl" : "hover:shadow-lg hover:translate-y-[-4px]",
        className
      )}
      {...props}
    >
      {popular && (
        <div className="absolute right-0 top-0 bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
          Popular
        </div>
      )}
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="my-6">
        <span className="text-3xl font-bold">
          {formattedPrice}
        </span>
        {price > 0 && <span className="text-muted-foreground">/month</span>}
      </div>
      <div className="space-y-3">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start">
            <Check className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-green-500" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
        {limitations.map((limitation, i) => (
          <div key={i} className="flex items-start">
            <X className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{limitation}</span>
          </div>
        ))}
      </div>
      
      {/* Pricing card button - updated for proper checkout flow */}
      <Button
        className={cn(
          "mt-6 w-full button-animation",
          popular ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}
        onClick={handlePlanClick}
      >
        {cta}
      </Button>
    </div>
  );
}
