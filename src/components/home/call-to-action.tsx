
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCheck, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="h-full">
      <div className="h-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Ready to Start?</h2>
          <p className="text-sm text-muted-foreground">Secure your creative work today</p>
        </div>
        
        <div className="bg-primary text-primary-foreground rounded-xl p-5 h-[calc(100%-4rem)] flex flex-col">
          <div className="flex flex-col justify-center items-center">
            <div className="mb-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCheck className="text-primary-foreground/90 h-4 w-4" />
                <p className="text-sm text-primary-foreground/90">Join thousands of satisfied creators</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="text-primary-foreground/90 h-4 w-4" />
                <p className="text-sm text-primary-foreground/90">Full protection guarantee</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-primary-foreground/90 h-4 w-4" />
                <p className="text-sm text-primary-foreground/90">Award-winning support team</p>
              </div>
            </div>
            
            <p className="text-sm text-primary-foreground/80 mb-4 text-center">
              Join thousands of content creators who trust Influence Guard to protect their work across the internet.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-background text-primary hover:bg-background/90 button-animation">
              <Link to="/signup">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
