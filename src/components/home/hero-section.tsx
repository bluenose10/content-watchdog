
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
          Protecting Creators, One Post at a Time. Discover where your content appears across the web, monitor for unauthorized usage, and take action to protect your intellectual property.
        </p>
        
        {/* Enhanced content protection section with workflow included */}
        <div className="w-full max-w-4xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-purple-100 dark:border-purple-900/40">
          <h2 className="text-xl font-semibold mb-6 text-purple-800 dark:text-purple-400">Comprehensive Content Protection Services</h2>
          
          {/* Core Services */}
          <div className="grid md:grid-cols-3 gap-6 text-left mb-10">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-purple-700 dark:text-purple-500 mr-2" />
                <h3 className="font-medium">Copyright Enforcement</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Automated detection and enforcement of your copyright claims across multiple platforms
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
                <h3 className="font-medium">Plagiarism Detection</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Advanced algorithms to identify copied content, even when slightly modified
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <FileCheck className="h-5 w-5 text-indigo-700 dark:text-indigo-500 mr-2" />
                <h3 className="font-medium">DMCA Takedowns</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Streamlined process for submitting legally-binding takedown notices with evidence
              </p>
            </div>
          </div>
          
          {/* How It Works Section - Enhanced workflow with more spacing */}
          <div className="relative">
            <h3 className="text-lg font-medium mb-8 text-center">How Our Protection Process Works</h3>
            
            {/* Connecting line - positioned lower with more space */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30 -z-10 translate-y-8"></div>
            
            <div className="grid md:grid-cols-3 gap-12 md:gap-16 relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6 shadow-sm">
                  <Search className="h-8 w-8 text-purple-700 dark:text-purple-400" />
                </div>
                <h4 className="text-lg font-medium mb-3">1. Find Content</h4>
                <p className="text-sm text-muted-foreground">
                  Our advanced search technology scans across platforms to locate your images and text content anywhere it appears online.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6 shadow-sm">
                  <Bell className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                </div>
                <h4 className="text-lg font-medium mb-3">2. Monitor Usage</h4>
                <p className="text-sm text-muted-foreground">
                  Set up continuous monitoring to receive alerts when new matches of your content are detected, with detailed reports and analytics.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6 shadow-sm">
                  <UserCheck className="h-8 w-8 text-indigo-700 dark:text-indigo-400" />
                </div>
                <h4 className="text-lg font-medium mb-3">2. Take Action</h4>
                <p className="text-sm text-muted-foreground">
                  Generate and send legally-binding DMCA takedown notices with all required evidence automatically compiled for you.
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};
