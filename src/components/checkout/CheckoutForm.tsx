
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CheckoutFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isProcessing: boolean;
  selectedPlanPrice: number;
}

export function CheckoutForm({ onSubmit, onCancel, isProcessing, selectedPlanPrice }: CheckoutFormProps) {
  // Card details state (not actually used but simulates real form)
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="card-name" className="text-foreground">Name on card</Label>
          <Input 
            id="card-name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            required
            className="bg-background/50 border-accent/30 focus:border-primary"
          />
        </div>
        
        <div>
          <Label htmlFor="card-number" className="text-foreground">Card number</Label>
          <Input 
            id="card-number" 
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            required
            maxLength={19}
            className="bg-background/50 border-accent/30 focus:border-primary"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry" className="text-foreground">Expiry date</Label>
            <Input 
              id="expiry" 
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              required
              maxLength={5}
              className="bg-background/50 border-accent/30 focus:border-primary"
            />
          </div>
          <div>
            <Label htmlFor="cvc" className="text-foreground">CVC</Label>
            <Input 
              id="cvc" 
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
              placeholder="123"
              required
              maxLength={3}
              className="bg-background/50 border-accent/30 focus:border-primary"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90" 
          disabled={isProcessing}
        >
          {isProcessing ? "Processing payment..." : `Pay $${selectedPlanPrice}`}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-accent/40 hover:bg-accent/10" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
