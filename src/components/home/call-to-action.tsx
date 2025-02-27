
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-2 text-center">Ready to Start?</h2>
      <p className="text-sm text-muted-foreground mb-3 text-center">Secure your creative work today</p>
      <div className="flex-grow flex flex-col justify-center items-center bg-primary text-primary-foreground rounded-xl p-5">
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
    </section>
  );
}
