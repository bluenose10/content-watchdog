
import { AboutSection } from "@/components/home/about-section";
import { CallToAction } from "@/components/home/call-to-action";
import { ContentSearchSection } from "@/components/home/content-search-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { PricingSection } from "@/components/home/pricing-section";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Show welcome toast when the page loads
    toast({
      title: "Welcome to InfluenceGuard",
      description: "Explore our platform designed to protect your content online.",
      duration: 5000,
    });
  }, [toast]);

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
