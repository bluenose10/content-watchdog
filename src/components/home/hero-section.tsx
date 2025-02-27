
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      window.scrollTo({
        top: featuresSection.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 pointer-events-none" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 animate-floating" style={{ animationDelay: "0s" }} />
        <div className="absolute top-1/3 -left-20 h-60 w-60 rounded-full bg-primary/5 animate-floating" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-20 right-1/4 h-40 w-40 rounded-full bg-primary/5 animate-floating" style={{ animationDelay: "1s" }} />
      </div>
      
      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center animate-fade-in">
        <div className="inline-flex items-center rounded-full border border-border/40 bg-background/95 px-3 py-1 text-sm backdrop-blur-md mb-6">
          <span className="text-muted-foreground">Protect your content online</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 max-w-3xl leading-tight">
          <span className="text-gradient">Protect Your Content</span> From Unauthorized Use
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
          {APP_NAME} helps influencers and content creators detect and monitor unauthorized use of their content across the internet.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button asChild size="lg" className="button-animation">
            <Link to="/signup">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={scrollToFeatures}>
            Learn More
            <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Hero image or mockup */}
        <div className="glass-card rounded-xl overflow-hidden shadow-2xl max-w-3xl w-full transition-all duration-500 hover:shadow-primary/10">
          <img
            src="https://placehold.co/1200x675/png"
            alt="InfluenceGuard Dashboard"
            className="w-full h-auto rounded-lg animate-pulse-subtle"
          />
        </div>
      </div>
    </section>
  );
}
