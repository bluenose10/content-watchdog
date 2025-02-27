
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <AnimatedGradientBorder 
              gradientClasses="from-primary/20 via-primary/40 to-primary/20"
              animationDuration="8s" 
              className="rounded-xl overflow-hidden"
            >
              <img 
                src="https://placehold.co/600x600/png" 
                alt="About InfluenceGuard" 
                className="w-full h-auto rounded-lg"
              />
            </AnimatedGradientBorder>
          </div>
          
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-border/40 bg-background/95 px-3 py-1 text-sm backdrop-blur-md">
              <span className="text-muted-foreground">Our Story</span>
            </div>
            
            <h2 className="text-3xl font-bold">Protecting Content Creators Since 2023</h2>
            
            <p className="text-muted-foreground">
              We started InfluenceGuard with a simple mission: to give content creators control over how their work is used online. After seeing countless creators struggle with content theft and misappropriation, we built a solution that leverages advanced technology to detect unauthorized usage across the web.
            </p>
            
            <p className="text-muted-foreground">
              Today, we help thousands of influencers, photographers, artists, and brands protect their intellectual property and maintain the integrity of their online presence. Our comprehensive search and monitoring tools provide the visibility creators need to take action when their content is used without permission.
            </p>
            
            <div className="pt-4">
              <Button asChild variant="outline" className="button-animation">
                <Link to="/signup">
                  Join Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
