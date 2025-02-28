
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { PricingSection } from "@/components/home/pricing-section";
import { AboutSection } from "@/components/home/about-section";
import { CallToAction } from "@/components/home/call-to-action";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FAQSection } from "@/components/home/faq-section";
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
          
          {/* First section with Call to Action only (ContentSearch removed) */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-24">
            <div className="col-span-1">
              <CallToAction />
            </div>
          </div>
          
          {/* Separator with gradient colors */}
          <div className="max-w-4xl mx-auto mb-24">
            <Separator className="h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30" />
          </div>
          
          {/* About Us section is now standalone */}
          <div className="mb-24" id="about">
            <AboutSection />
          </div>
          
          {/* Separator with gradient colors */}
          <div className="max-w-4xl mx-auto mb-24">
            <Separator className="h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30" />
          </div>
          
          {/* Second section with Features and Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <div className="col-span-1">
              <FeaturesSection />
            </div>
            <div className="col-span-1">
              <TestimonialsSection />
            </div>
          </div>
          
          {/* Separator with gradient colors */}
          <div className="max-w-4xl mx-auto mb-24">
            <Separator className="h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30" />
          </div>
          
          {/* Pricing section */}
          <div className="mb-24" id="pricing">
            <PricingSection />
          </div>
          
          {/* Separator with gradient colors */}
          <div className="max-w-4xl mx-auto mb-16">
            <Separator className="h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30" />
          </div>
          
          {/* FAQ section */}
          <div className="mb-24" id="faq">
            <FAQSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
