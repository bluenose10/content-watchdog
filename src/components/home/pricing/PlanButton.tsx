
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PlanButtonProps {
  planId: string;
  variant: "default" | "outline" | "secondary";
  label: string;
  className?: string;
}

export function PlanButton({ planId, variant, label, className }: PlanButtonProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanClick = () => {
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
    <Button 
      onClick={handlePlanClick} 
      variant={variant} 
      className={`w-full ${className || ''}`}
    >
      {label}
    </Button>
  );
}
