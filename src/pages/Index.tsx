
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { ContentSearchSection } from "@/components/home/content-search-section";
import { PricingSection } from "@/components/home/pricing-section";
import { AboutSection } from "@/components/home/about-section";
import { CallToAction } from "@/components/home/call-to-action";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Index() {
  const location = useLocation();

  useEffect(() => {
    // Handle anchor links
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        
        <div className="container py-12 text-center px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-6">Comprehensive Content Protection</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Our platform provides you with all the tools you need to find, monitor, and protect your content across the web.
          </p>
          
          {/* First section with About Us, Content Search, and Call to Action */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            <div className="col-span-1">
              <AboutSection />
            </div>
            <div className="col-span-1" id="content-search-section">
              <ContentSearchSection />
            </div>
            <div className="col-span-1">
              <CallToAction />
            </div>
          </div>
          
          {/* Separator */}
          <div className="max-w-4xl mx-auto mb-32">
            <Separator className="border-dotted border-t-2" />
          </div>
          
          {/* Second section with Features and Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            <div className="col-span-1">
              <FeaturesSection />
            </div>
            <div className="col-span-1">
              <TestimonialsSection />
            </div>
          </div>
          
          {/* Separator */}
          <div className="max-w-4xl mx-auto mb-32">
            <Separator className="border-dotted border-t-2" />
          </div>
          
          {/* Pricing section */}
          <div className="mb-32">
            <PricingSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
