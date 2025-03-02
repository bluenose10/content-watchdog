
import { ReactNode } from "react";
import { CreditCard, Lock, ShoppingCart } from "lucide-react";

type IconType = "credit-card" | "lock" | "shopping-cart";

interface CheckoutHeaderProps {
  title: string;
  subtitle?: string;
  icon?: IconType;
  className?: string;
}

export function CheckoutHeader({ 
  title, 
  subtitle, 
  icon = "credit-card", 
  className = "" 
}: CheckoutHeaderProps) {
  
  const renderIcon = (): ReactNode => {
    switch (icon) {
      case "credit-card":
        return <CreditCard className="h-6 w-6 text-primary" />;
      case "lock":
        return <Lock className="h-6 w-6 text-primary" />;
      case "shopping-cart":
        return <ShoppingCart className="h-6 w-6 text-primary" />;
      default:
        return <CreditCard className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className={`space-y-2 text-center ${className}`}>
      <div className="flex justify-center">
        <div className="bg-primary/20 p-3 rounded-full">
          {renderIcon()}
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gradient">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
