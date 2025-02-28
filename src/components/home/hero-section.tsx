
import { ArrowRight, Shield, Zap, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        
        {/* Added service highlight section */}
        <div className="w-full max-w-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100 dark:border-purple-900/40">
          <h2 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-400">Comprehensive Content Protection Services</h2>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-purple-700 dark:text-purple-500 mr-2" />
                <h3 className="font-medium">Copyright Enforcement</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Automated detection and enforcement of your copyright claims across multiple platforms
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2" />
                <h3 className="font-medium">Plagiarism Detection</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Advanced algorithms to identify copied content, even when slightly modified
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <FileCheck className="h-5 w-5 text-indigo-700 dark:text-indigo-500 mr-2" />
                <h3 className="font-medium">DMCA Takedowns</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                Streamlined process for submitting legally-binding takedown notices with evidence
              </p>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-3xl pt-8 md:pt-12">
          <div className="grid gap-6 md:grid-cols-3 purple-dot-pattern p-8 rounded-xl glass-card">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                <Shield className="h-6 w-6 text-purple-700 dark:text-purple-400" />
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
          <button 
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground group cursor-pointer"
          >
            Learn more about our features
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
