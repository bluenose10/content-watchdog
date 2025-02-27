
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container text-center max-w-3xl">
        <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Content?</h2>
        <p className="text-lg text-primary-foreground/80 mb-8">
          Join thousands of content creators who trust InfluenceGuard to protect their work across the internet. Start your free trial today.
        </p>
        <Button asChild size="lg" variant="secondary" className="button-animation">
          <Link to="/signup">
            Get Started Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
