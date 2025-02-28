
import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/lib/constants";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const planId = searchParams.get("plan_id");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<any>(null);

  // Find the plan details based on the plan ID
  useEffect(() => {
    if (planId) {
      const selectedPlan = PRICING_PLANS.find(p => p.id === planId);
      if (selectedPlan) {
        setPlan(selectedPlan);
      }
    }
  }, [planId]);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access subscription details",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [user, toast, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-50 p-8 flex flex-col items-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-green-900">Payment Successful!</h1>
          <p className="mt-2 text-center text-green-700">
            Thank you for your subscription. Your account has been upgraded.
          </p>
        </div>
        
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Subscription Details</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Plan</span>
                <span className="font-medium">{plan?.name || "Premium Plan"}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">${plan?.price || "49"}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-500 font-medium">Active</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <div className="text-center text-sm text-gray-500">
              If you have any questions, please{" "}
              <Link to="/support" className="text-primary hover:underline">
                contact support
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
