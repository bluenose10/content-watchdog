
import { AboutSection } from "@/components/home/about-section";
import { CallToAction } from "@/components/home/call-to-action";
import { ContentSearchSection } from "@/components/home/content-search-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { PricingSection } from "@/components/home/pricing-section";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const Index = () => {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Show welcome toast when the page loads
      toast({
        title: "Welcome to InfluenceGuard",
        description: "Explore our platform designed to protect your content online.",
        duration: 5000,
      });
    } catch (err) {
      console.error("Toast error:", err);
      setError("Failed to display welcome message");
    }
  }, [toast]);

  // Fallback UI for errors
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <ContentSearchSection />
        <PricingSection />
        <AboutSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
