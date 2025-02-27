
import { ArrowRight, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
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
        <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center">
          <button
            id="signupButton"
            onClick={handleSignUp}
            className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-200 cursor-pointer"
          >
            Sign Up Now
          </button>
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
