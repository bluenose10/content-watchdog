
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export function PremiumFeatureCard() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/60 dark:to-indigo-950/60 p-5 rounded-lg border border-purple-200 dark:border-purple-800 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
          <Lock className="h-5 w-5 text-purple-700 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-400 mb-1">Premium Feature</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Advanced filters and search customization are available exclusively for premium users.
          </p>
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="text-xs border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            >
              <Link to="/#pricing">
                Upgrade to Premium
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
