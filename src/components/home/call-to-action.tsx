
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="h-full">
      <div className="h-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Ready to Start?</h2>
          <p className="text-sm text-muted-foreground">Secure your creative work today</p>
        </div>
        
        <div className="bg-primary text-primary-foreground rounded-xl p-5 h-[calc(100%-4rem)] flex flex-col justify-center">
          <div className="flex-grow flex flex-col justify-center items-center">
            <p className="text-sm text-primary-foreground/80 mb-4 text-center">
              Join thousands of content creators who trust Influence Guard to protect their work across the internet.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-white/80 text-primary hover:bg-white button-animation">
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
