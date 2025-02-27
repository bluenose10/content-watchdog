
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/stripe/CheckoutButton";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import React from "react";
import { useAuth } from "@/context/AuthContext";

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

  // Ensure price is properly formatted
  const formattedPrice = price === 0 ? "Free" : `$${price.toFixed(2)}`;

  return (
    <div
      className={cn(
        "relative glass-card overflow-hidden rounded-xl p-6 transition-all duration-300",
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
      
      {/* Conditionally render either the CheckoutButton or regular Button */}
      {user && planId && price > 0 ? (
        <CheckoutButton
          planId={planId}
          variant={popular ? "blue" : "default"}
          className="mt-6 w-full button-animation"
        >
          {cta}
        </CheckoutButton>
      ) : (
        <Button
          className={cn(
            "mt-6 w-full button-animation",
            popular ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          )}
          onClick={onClick}
        >
          {cta}
        </Button>
      )}
    </div>
  );
}
