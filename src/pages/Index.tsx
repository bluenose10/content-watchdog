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
import { Shield, FileText, Copyright } from "lucide-react";
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

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
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center pt-6 md:py-4 text-gradient">Comprehensive Content Protection</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-8 text-center">
            Our platform provides you with all the tools you need to find, monitor, and protect your content across the web.
          </p>
          
          {/* Educational Resources Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 md:mb-16">
            <div className="col-span-1 md:col-span-3">
              <h3 className="text-xl font-bold mb-4 text-center text-gradient">Educational Resources</h3>
            </div>
            
            <div className="col-span-1 p-6 bg-card rounded-lg border border-border hover:shadow-md transition-all">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2 mr-3">
                    <Copyright className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-lg font-semibold">Copyright Protection</h4>
                </div>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Understand the legal framework for protecting your original content and intellectual property.
                </p>
                <Button asChild variant="outline" className="w-full mt-auto">
                  <Link to="/piracy" className="flex items-center justify-center">
                    Learn About Content Theft
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="col-span-1 p-6 bg-card rounded-lg border border-border hover:shadow-md transition-all">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2 mr-3">
                    <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="text-lg font-semibold">Plagiarism Detection</h4>
                </div>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Discover how our tools can help you identify when your content has been used without proper attribution.
                </p>
                <Button asChild variant="outline" className="w-full mt-auto">
                  <Link to="/search" className="flex items-center justify-center">
                    Try Our Detection Tools
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="col-span-1 p-6 bg-card rounded-lg border border-border hover:shadow-md transition-all">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 mr-3">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold">DMCA Protection</h4>
                </div>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Learn how to use legal frameworks like DMCA to enforce your rights and protect your digital content.
                </p>
                <Button asChild variant="outline" className="w-full mt-auto">
                  <Link to="/protection" className="flex items-center justify-center">
                    Explore Protection Options
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* First section with Call to Action only */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 mb-10 md:mb-24" id="features">
            <div className="col-span-1">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-gradient">Key Features</h3>
                <p className="text-sm text-muted-foreground mb-4">Tools trusted by photographers, writers, and brands</p>
              </div>
              <FeaturesSection />
            </div>
            <div className="col-span-1">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-gradient">What Users Say</h3>
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
