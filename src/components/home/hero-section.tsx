
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, Shield, Zap } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  // Direct navigation to the Content Search section ID
  const handleSearchNow = () => {
    // Use document.querySelector which is more reliable than getElementById
    const contentSearchSection = document.querySelector('#content-search-section');
    if (contentSearchSection) {
      contentSearchSection.scrollIntoView({ behavior: 'smooth' });
      console.log("Scrolling to content search section");
    } else {
      console.error("Content search section not found, trying alternative");
      // Try to find any element with the search section ID
      const anySearchSection = document.querySelector('[id*="search"]');
      if (anySearchSection) {
        anySearchSection.scrollIntoView({ behavior: 'smooth' });
        console.log("Scrolling to found search section");
      } else {
        console.error("No search section found at all");
      }
    }
  };

  // Direct navigation to signup page
  const handleCreateAccount = () => {
    console.log("Navigating to signup page");
    navigate('/signup');
  };

  return (
    <section className="w-full pt-24 md:pt-32 lg:pt-40 pb-20 md:pb-32 hero-background">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-gradient max-w-3xl mx-auto" style={{ color: 'hsl(262, 83%, 38%)' }}>
          Protect Your Digital Content from Unauthorized Use
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Protecting Creators, One Post at a Time. Discover where your content appears across the web, monitor for unauthorized usage, and take action to protect your intellectual property.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a 
            href="#content-search-section"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 rounded-md px-8 bg-gradient-to-r from-purple-600 to-blue-600 text-primary-foreground hover:from-purple-700 hover:to-blue-700 shadow-sm hover:shadow-md cursor-pointer button-animation"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Now
          </a>
          <a 
            href="/signup"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 rounded-md px-8 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:from-indigo-500/20 hover:to-blue-500/20 cursor-pointer"
          >
            <Shield className="mr-2 h-5 w-5" />
            Create Account
          </a>
        </div>
        <div className="w-full max-w-3xl pt-8 md:pt-12">
          <div className="grid gap-6 md:grid-cols-3 purple-dot-pattern p-8 rounded-xl glass-card">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                <Search className="h-6 w-6 text-purple-700 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-medium mb-1">Find Content</h3>
              <p className="text-sm text-muted-foreground">
                Search across platforms to locate your images and text
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Zap className="h-6 w-6 text-blue-700 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium mb-1">Monitor Usage</h3>
              <p className="text-sm text-muted-foreground">
                Get alerts when new matches of your content are detected
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                <Shield className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-medium mb-1">Take Action</h3>
              <p className="text-sm text-muted-foreground">
                Send DMCA takedown notices with evidence provided
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center">
          <Link
            to="#features"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground group"
          >
            Learn more about our features
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
