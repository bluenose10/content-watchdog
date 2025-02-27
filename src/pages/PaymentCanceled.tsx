
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function PaymentCanceled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="text-center space-y-4">
          <div className="bg-red-100 p-3 rounded-full inline-flex">
            <X className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold">Payment Canceled</h1>
          <p className="text-muted-foreground">
            Your payment was canceled. No charges were made.
          </p>
          <div className="pt-4 space-y-2">
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")} 
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
