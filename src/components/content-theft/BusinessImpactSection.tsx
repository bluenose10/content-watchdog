
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, Search, Shield, CheckCircle, ArrowRight } from "lucide-react";

export const BusinessImpactSection = () => {
  return (
    <section id="why-this-matters" className="border-t border-gray-200 dark:border-gray-800 pt-12">
      <h2 className="text-2xl font-bold mb-6">Why This Matters For Your Business</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="rounded-full w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-900/20 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Copyright Infringement</h3>
          <p className="text-muted-foreground">
            Our services directly address this legal issue through DMCA takedowns and copyright enforcement tools.
          </p>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="rounded-full w-12 h-12 flex items-center justify-center bg-amber-100 dark:bg-amber-900/20 mb-4">
            <Search className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Plagiarism</h3>
          <p className="text-muted-foreground">
            We offer tools for detecting copied content and ensuring proper attribution for your work.
          </p>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="rounded-full w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/20 mb-4">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Content Theft</h3>
          <p className="text-muted-foreground">
            Our platform helps monitor, detect, and stop unauthorized use of your digital content.
          </p>
        </div>
      </div>
      
      <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="text-xl font-medium text-purple-800 dark:text-purple-300 mb-4">How Influence Guard Protects Your Work</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground">Advanced content monitoring to detect unauthorized use</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground">Automated DMCA takedown tools for swift action</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground">Plagiarism detection across websites and social media</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-muted-foreground">Digital fingerprinting to track your intellectual property</span>
          </li>
        </ul>
        <div className="mt-6">
          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
            <Link to="/search" className="flex items-center justify-center">
              Start Protecting Your Content
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
