
import { ArrowRight, Shield, Zap, FileCheck, Bell, Search, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full pt-24 md:pt-32 lg:pt-40 pb-20 md:pb-32 hero-background">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-gradient max-w-3xl mx-auto" style={{ color: 'hsl(262, 83%, 38%)' }}>
          Find Your Stolen Content & Get DMCA Takedowns
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          For Content Creators Needing DMCA Protection. We locate where your photos, videos, articles, and designs are being used without permission, providing detailed evidence for your legal team to issue takedowns.
        </p>
        
        {/* Enhanced content protection section with workflow included */}
        <div className="w-full max-w-4xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl px-8 py-8 pt-14 border border-purple-100 dark:border-purple-900/40">
          <h2 className="text-xl font-semibold mb-6 text-purple-800 dark:text-purple-400">Duplicate Content Detection & DMCA Services</h2>
          
          {/* Core Services - Updated with specific examples */}
          <div className="grid md:grid-cols-3 gap-6 text-left mb-16">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-purple-700 dark:text-purple-500 mr-2" />
                <h3 className="font-medium">DMCA Evidence</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                We provide comprehensive findings for your legal team to use when issuing DMCA takedowns, with detailed proof of infringement
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
                <h3 className="font-medium">Stolen Content Finder</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Our specialized search finds where others have duplicated your content, even when they've slightly modified it
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <FileCheck className="h-5 w-5 text-indigo-700 dark:text-indigo-500 mr-2" />
                <h3 className="font-medium">Creator Protection</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Made specifically for content creators who need comprehensive evidence to support their legal team's DMCA actions
              </p>
            </div>
          </div>
          
          {/* How It Works Section - Restyled to match core services section */}
          <div>
            <h3 className="text-lg font-medium mb-8 text-center">How Our DMCA Protection Works</h3>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3">
                    <Search className="h-5 w-5 text-purple-700 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium">1. Find Duplicates</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-[52px]">
                  Our search technology locates where your content has been duplicated across websites and social platforms, identifying unauthorized copies of your work.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                    <Bell className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium">2. Verify Usage</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-[52px]">
                  Review our detailed reports showing where your content appears without permission, with screenshots and links to where each unauthorized duplicate was found.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3">
                    <UserCheck className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-medium">3. Prepare Evidence</h4>
                </div>
                <p className="text-sm text-muted-foreground pl-[52px]">
                  We compile comprehensive documentation for your legal team to use when issuing DMCA takedowns, saving your solicitors time in preparing strong cases.
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};
