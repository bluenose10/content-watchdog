
import { ArrowRight, Shield, Zap, FileCheck, Bell, Search, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="w-full pt-16 md:pt-24 lg:pt-40 pb-16 md:pb-20 lg:pb-32 hero-background">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6 md:space-y-8">
        <div className="space-y-3 md:space-y-4">
          <div className="inline-block animate-fade-in bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full px-3 py-1 text-xs md:text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
            Content Protection for Creators
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold tracking-tighter text-gradient max-w-3xl mx-auto animate-scale-in" style={{ animationDelay: "0.2s" }}>
            Find Your Stolen Content & Get DMCA Takedowns
          </h1>
        </div>
        
        <p className="text-sm md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto animate-scale-in" style={{ animationDelay: "0.4s" }}>
          For Content Creators Needing DMCA Protection. We locate where your photos, videos, articles, and designs are being used without permission, providing detailed evidence for your legal team to issue takedowns.
        </p>
        
        <p className="text-xs md:text-sm text-purple-600 dark:text-purple-400 max-w-2xl mx-auto animate-scale-in font-medium" style={{ animationDelay: "0.5s" }}>
          Sign up for a free basic account to start searching - our free plan includes 4 searches per month so you can see what's out there.
        </p>
        
        {/* Enhanced content protection section with workflow included */}
        <div className="w-full max-w-4xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl px-4 md:px-8 py-6 md:py-8 pt-10 md:pt-14 border border-purple-100 dark:border-purple-900/40 mt-8 md:mt-12 shadow-md hover:shadow-lg transition-shadow duration-300 purple-glow">
          <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-purple-800 dark:text-purple-400">Duplicate Content Detection & DMCA Services</h2>
          
          {/* Core Services - Updated with specific examples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left mb-12 md:mb-16">
            <div className="flex flex-col space-y-2 md:space-y-3 shimmer-effect">
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 text-purple-700 dark:text-purple-500" />
                </div>
                <h3 className="font-medium text-sm md:text-base">DMCA Evidence</h3>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground pl-12">
                We provide comprehensive findings for your legal team to use when issuing DMCA takedowns, with detailed proof of infringement
              </p>
            </div>
            <div className="flex flex-col space-y-2 md:space-y-3 shimmer-effect">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-500" />
                </div>
                <h3 className="font-medium text-sm md:text-base">Stolen Content Finder</h3>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground pl-12">
                Our specialized search finds where others have duplicated your content, even when they've slightly modified it
              </p>
            </div>
            <div className="flex flex-col space-y-2 md:space-y-3 shimmer-effect">
              <div className="flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-3">
                  <FileCheck className="h-4 w-4 md:h-5 md:w-5 text-indigo-700 dark:text-indigo-500" />
                </div>
                <h3 className="font-medium text-sm md:text-base">Creator Protection</h3>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground pl-12">
                Made specifically for content creators who need comprehensive evidence to support their legal team's DMCA actions
              </p>
            </div>
          </div>
          
          {/* How It Works Section - Restyled for better visual hierarchy */}
          <div>
            <div className="mb-6 md:mb-8 py-2 relative">
              <h3 className="text-base md:text-lg font-medium text-center">How Our DMCA Protection Works</h3>
              <div className="absolute left-0 right-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-700 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              <div className="flex flex-col space-y-2 md:space-y-3 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3 shadow-sm">
                    <Search className="h-5 w-5 md:h-6 md:w-6 text-purple-700 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium text-sm md:text-base text-purple-800 dark:text-purple-400">1. Find Duplicates</h4>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground pl-[55px] md:pl-[60px]">
                  Our search technology locates where your content has been duplicated across websites and social platforms, identifying unauthorized copies of your work.
                </p>
              </div>
              
              <div className="flex flex-col space-y-2 md:space-y-3 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3 shadow-sm">
                    <Bell className="h-5 w-5 md:h-6 md:w-6 text-blue-700 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium text-sm md:text-base text-blue-700 dark:text-blue-400">2. Verify Usage</h4>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground pl-[55px] md:pl-[60px]">
                  Review our detailed reports showing where your content appears without permission, with screenshots and links to where each unauthorized duplicate was found.
                </p>
              </div>
              
              <div className="flex flex-col space-y-2 md:space-y-3 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3 shadow-sm">
                    <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-indigo-700 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-medium text-sm md:text-base text-indigo-700 dark:text-indigo-400">3. Prepare Evidence</h4>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground pl-[55px] md:pl-[60px]">
                  We compile comprehensive documentation for your legal team to use when issuing DMCA takedowns, saving your solicitors time in preparing strong cases.
                </p>
              </div>
            </div>
          </div>
          
          {/* Added Stat Section */}
          <div className="mt-12 md:mt-16 pt-6 border-t border-purple-100 dark:border-purple-900/40">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
              <div className="p-3 md:p-4">
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-700 dark:text-purple-400">98%</p>
                <p className="text-xs md:text-sm text-muted-foreground">Detection Accuracy</p>
              </div>
              <div className="p-3 md:p-4">
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">50+</p>
                <p className="text-xs md:text-sm text-muted-foreground">Platforms Monitored</p>
              </div>
              <div className="p-3 md:p-4">
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-indigo-600 dark:text-indigo-400">1.5M+</p>
                <p className="text-xs md:text-sm text-muted-foreground">Content Items Protected</p>
              </div>
              <div className="p-3 md:p-4">
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-300">92%</p>
                <p className="text-xs md:text-sm text-muted-foreground">Successful Takedowns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
