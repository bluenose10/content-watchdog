import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PRICING_PLANS } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PlanSummary } from "@/components/checkout/PlanSummary";
import { SecurityNotice } from "@/components/checkout/SecurityNotice";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";

export default function MockCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const sessionId = searchParams.get("session_id") || `mock_sess_${Date.now()}`;
  const planId = searchParams.get("plan_id");
  const returnUrl = searchParams.get("return_url") || "/payment/success";
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue with checkout",
        variant: "destructive"
      });
      navigate("/login");
    }

    if (!planId || !PRICING_PLANS.some(plan => plan.id === planId)) {
      toast({
        title: "Invalid plan",
        description: "The selected plan is invalid or no longer available",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [user, planId, navigate, toast]);
  
  const selectedPlan = PRICING_PLANS.find(plan => plan.id === planId) || {
    name: "Subscription Plan",
    price: 49,
    interval: "month",
    features: []
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      navigate(`/payment/success?session_id=${sessionId}&plan_id=${planId}`);
    }, 1500);
  };
  
  const handleCancel = () => {
    navigate("/payment/canceled");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sidebar-background to-background/90 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 card-gradient p-8 rounded-lg shadow-lg purple-glow">
        <CheckoutHeader 
          title="Complete your payment"
          subtitle="This is a simulated checkout page for development."
          icon="credit-card"
        />

        <PlanSummary 
          name={selectedPlan.name}
          price={selectedPlan.price}
          interval={selectedPlan.interval}
          features={selectedPlan.features}
        />

        <SecurityNotice message="Your payment information is secure" />
        
        <CheckoutForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isProcessing={isProcessing}
          selectedPlanPrice={selectedPlan.price}
        />
      </div>
      
      <SecurityNotice 
        message="Test mode - no actual payments will be processed" 
        className="mt-4"
      />
    </div>
  );
}
