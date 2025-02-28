
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
        
        <div className="container px-4 md:px-8 lg:px-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center pt-6 md:py-4">Comprehensive Content Protection</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-8 text-center">
            Our platform provides you with all the tools you need to find, monitor, and protect your content across the web.
          </p>
          
          {/* First section with Call to Action only (ContentSearch removed) */}
          <div className="grid grid-cols-1 gap-8 mb-10 md:mb-24">
            <div className="col-span-1">
              <CallToAction />
            </div>
          </div>
          
          {/* Separator with gradient colors */}
          <div className="max-w-4xl mx-auto mb-10 md:mb-24">
            <Separator className="h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30" />
          </div>
          
          {/* About Us section is now standalone */}
          <div className="mb-10 md:mb-24" id="about">
            <AboutSection />
          </div>
          
          {/* Separator with gradient colors */}
          <div className="max-w-4xl mx-auto mb-10 md:mb-24">
            <Separator className="h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30" />
          </div>
          
          {/* Features and Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 mb-10 md:mb-24">
            <div className="col-span-1">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Key Features</h3>
                <p className="text-sm text-muted-foreground mb-4">Tools trusted by photographers, writers, and brands</p>
              </div>
              <FeaturesSection />
            </div>
            <div className="col-span-1">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2">What Users Say</h3>
                <p className="text-sm text-muted-foreground mb-4">Read experiences from our customers</p>
              </div>
              <TestimonialsSection />
            </div>
          </div>
          
          {/* Separator with gradient colors */}
          <div className="max-w-4xl mx-auto mb-10 md:mb-24">
            <Separator className="h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30" />
          </div>
          
          {/* Pricing section */}
          <div className="mb-10 md:mb-24" id="pricing">
            <PricingSection />
          </div>
          
          {/* Separator with gradient colors */}
          <div className="max-w-4xl mx-auto mb-8 md:mb-16">
            <Separator className="h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30" />
          </div>
          
          {/* FAQ section */}
          <div className="mb-10 md:mb-24 pb-8 md:pb-0" id="faq">
            <FAQSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
