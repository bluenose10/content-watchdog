
import { AboutSection } from "@/components/home/about-section";
import { CallToAction } from "@/components/home/call-to-action";
import { ContentSearchSection } from "@/components/home/content-search-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { PricingSection } from "@/components/home/pricing-section";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (!loading && user) {
      navigate("/dashboard");
      return;
    }

    // Only show welcome toast for non-authenticated users
    if (!loading && !user) {
      try {
        toast({
          title: "Welcome to InfluenceGuard",
          description: "Explore our platform designed to protect your content online.",
          duration: 5000,
        });
      } catch (err) {
        console.error("Toast error:", err);
        setError("Failed to display welcome message");
      }
    }
  }, [toast, user, loading, navigate]);

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

  // Don't render anything while loading or if user is authenticated (will redirect)
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
