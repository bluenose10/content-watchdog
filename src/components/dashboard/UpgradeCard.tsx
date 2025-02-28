
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function UpgradeCard() {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
      <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-2xl"></div>
      
      <CardHeader className="relative z-10 border-b border-purple-100 dark:border-purple-800/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <CardTitle className="text-2xl font-bold text-gradient">Upgrade to Pro</CardTitle>
        </div>
        <CardDescription className="text-base">
          Get unlimited searches and advanced features
        </CardDescription>
      </CardHeader>
      <CardContent className="py-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <p className="text-gradient font-semibold text-lg mb-3">Protect Your Content From Unauthorized Use</p>
            <ul className="space-y-2.5">
              <li className="flex items-center text-sm group">
                <div className="flex-shrink-0 h-5 w-5 mr-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <Shield className="h-3 w-3 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">Unlimited search results</span>
              </li>
              <li className="flex items-center text-sm group">
                <div className="flex-shrink-0 h-5 w-5 mr-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Advanced content monitoring</span>
              </li>
              <li className="flex items-center text-sm group">
                <div className="flex-shrink-0 h-5 w-5 mr-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <Shield className="h-3 w-3 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">10 automated monitoring sessions</span>
              </li>
              <li className="flex items-center text-sm group">
                <div className="flex-shrink-0 h-5 w-5 mr-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <Shield className="h-3 w-3 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">Export results in multiple formats</span>
              </li>
            </ul>
          </div>
          <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-purple-100 dark:border-purple-900">
            <p className="text-3xl font-bold mb-2">$49<span className="text-sm font-normal text-muted-foreground">.99/mo</span></p>
            <Button className="button-animation w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 cursor-pointer" asChild>
              <Link to="/#pricing">
                Upgrade Now
                <Zap className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Cancel anytime • 14-day money back guarantee</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
