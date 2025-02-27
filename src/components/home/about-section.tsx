
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutSection() {
  return (
    <section id="about" className="h-full">
      <div className="h-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">About Us</h2>
          <p className="text-sm text-muted-foreground">Our mission and story</p>
        </div>
        
        <div className="space-y-4">
          <AnimatedGradientBorder 
            gradientClasses="from-primary/20 via-primary/40 to-primary/20"
            animationDuration="8s" 
            className="rounded-xl overflow-hidden"
          >
            <img 
              src="https://placehold.co/600x300/png" 
              alt="About InfluenceGuard" 
              className="w-full h-auto rounded-lg"
            />
          </AnimatedGradientBorder>
          
          <div className="space-y-3">            
            <p className="text-sm text-muted-foreground">
              We started InfluenceGuard with a simple mission: to give content creators control over how their work is used online. After seeing countless creators struggle with content theft, we built a solution that leverages advanced technology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
