
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/content-theft/HeroSection";
import { KeyConcepts } from "@/components/content-theft/KeyConcepts";
import { ContentTheftMainContent } from "@/components/content-theft/ContentTheftMainContent";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Piracy = () => {
  // Add useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container px-4 md:px-6 pt-16 pb-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
          {/* Sidebar with Key Concepts */}
          <KeyConcepts />
          
          {/* Main Content Area */}
          <ContentTheftMainContent />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Piracy;
