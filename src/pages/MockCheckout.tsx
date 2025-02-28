
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PRICING_PLANS } from "@/lib/constants";
import { CreditCard, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function MockCheckout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get parameters from URL
  const sessionId = searchParams.get("session_id") || `mock_sess_${Date.now()}`;
  const planId = searchParams.get("plan_id");
  const returnUrl = searchParams.get("return_url") || "/payment/success";
  
  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue with checkout",
        variant: "destructive"
      });
      navigate("/login");
    }

    // Check if plan ID is valid
    if (!planId || !PRICING_PLANS.some(plan => plan.id === planId)) {
      toast({
        title: "Invalid plan",
        description: "The selected plan is invalid or no longer available",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [user, planId, navigate, toast]);
  
  // Find plan details
  const selectedPlan = PRICING_PLANS.find(plan => plan.id === planId) || {
    name: "Subscription Plan",
    price: 49,
    interval: "month",
    features: []
  };
  
  // Card details state (not actually used but simulates real form)
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      // Redirect to success page with session ID
      navigate(`/payment/success?session_id=${sessionId}&plan_id=${planId}`);
    }, 1500);
  };
  
  const handleCancel = () => {
    navigate("/payment/canceled");
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date MM/YY
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    
    return v;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-2 rounded-full">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Complete your payment</h1>
          <p className="text-sm text-gray-500">This is a simulated checkout page for development.</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-medium">{selectedPlan.name}</span>
            <span className="font-bold">${selectedPlan.price}/{selectedPlan.interval || "month"}</span>
          </div>
          {selectedPlan.features && selectedPlan.features.length > 0 && (
            <div className="mt-2 space-y-1">
              <Separator className="my-2" />
              <ul className="text-xs text-gray-500 list-disc ml-4 space-y-1">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-name">Name on card</Label>
              <Input 
                id="card-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="card-number">Card number</Label>
              <Input 
                id="card-number" 
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                required
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry date</Label>
                <Input 
                  id="expiry" 
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  required
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input 
                  id="cvc" 
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  required
                  maxLength={3}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center text-xs text-gray-500 gap-1">
            <Lock className="h-3 w-3" />
            <span>Your payment information is secure</span>
          </div>
          
          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessing}
            >
              {isProcessing ? "Processing payment..." : `Pay $${selectedPlan.price}`}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
        <Lock className="h-3 w-3" />
        <span>Test mode - no actual payments will be processed</span>
      </div>
    </div>
  );
}
