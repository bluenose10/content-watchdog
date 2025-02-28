
import { ArrowRight, Shield, Zap, FileCheck, Bell, Search, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-24 md:pt-32 lg:pt-40 pb-20 md:pb-32 hero-background">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-gradient max-w-3xl mx-auto" style={{ color: 'hsl(262, 83%, 38%)' }}>
          Protect Your Digital Content from Unauthorized Use
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Protecting Content Creators, Photographers, Writers, and Brands. Discover where your photos, videos, articles, and designs appear across the web and take action to protect your intellectual property.
        </p>
        
        {/* Enhanced content protection section with workflow included */}
        <div className="w-full max-w-4xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 pt-4 border border-purple-100 dark:border-purple-900/40">
          <h2 className="text-xl font-semibold mb-6 text-purple-800 dark:text-purple-400">Comprehensive Content Protection Services</h2>
          
          {/* Core Services - Updated with specific examples */}
          <div className="grid md:grid-cols-3 gap-6 text-left mb-16">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-purple-700 dark:text-purple-500 mr-2" />
                <h3 className="font-medium">Copyright Enforcement</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Automated detection and enforcement of your copyright claims for photos, videos, written content, and designs
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
                <h3 className="font-medium">Plagiarism Detection</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Our AI identifies even slightly modified copies of your content across social media and websites
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <FileCheck className="h-5 w-5 text-indigo-700 dark:text-indigo-500 mr-2" />
                <h3 className="font-medium">DMCA Takedowns</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                We've helped remove over 10,000+ unauthorized content copies with our legally-binding takedown process
              </p>
            </div>
          </div>
          
          {/* How It Works Section - Restyled to match core services section */}
          <div>
            <h3 className="text-lg font-medium mb-8 text-center">How Our Protection Process Works</h3>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3">
                    <Search className="h-5 w-5 text-purple-700 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium">1. Find Content</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-[52px]">
                  Our technology scans millions of websites and social platforms to locate where your images, videos, and text content appear online, even when modified.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                    <Bell className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium">2. Monitor Usage</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-[52px]">
                  Get instant alerts when your content is found with our 24/7 monitoring system that checks 50+ platforms, including Instagram, TikTok, Twitter, and websites.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3">
                    <UserCheck className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-medium">3. Take Action</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-[52px]">
                  With a 92% success rate, our automated DMCA takedown system removes unauthorized content quickly, with all evidence and legal documentation handled for you.
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};
