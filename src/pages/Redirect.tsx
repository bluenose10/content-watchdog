
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const Redirect = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md animate-scale-in text-center">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/72940714-67ad-4d39-a726-825cccfb266f.png" 
            alt="BlockSyde Logo" 
            className="h-16 w-16 mx-auto mb-4" 
          />
          <h1 className="text-3xl font-bold text-gradient">{APP_NAME} Has Moved</h1>
        </div>
        
        <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
          <p className="mb-6 text-lg">
            Thank you for your interest in {APP_NAME}. We've moved to a new home!
          </p>
          
          <p className="mb-8 text-muted-foreground">
            All our services are now available at our new website. Please visit us at our new address to continue using our platform.
          </p>
          
          <Button 
            className="w-full text-lg py-6 button-animation" 
            size="lg"
            onClick={() => window.location.href = "https://blocksyde.com"}
          >
            Continue to BlockSyde.com
          </Button>
          
          <p className="mt-6 text-sm text-muted-foreground">
            If you're not redirected automatically, please click the button above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Redirect;
