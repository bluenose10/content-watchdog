
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function ServiceLevelCard() {
  return (
    <Card className="relative overflow-hidden glass-card transition-all duration-300 hover:shadow-lg
      before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-purple-200 before:via-blue-200 before:to-indigo-200 dark:before:from-purple-900/30 dark:before:via-blue-900/30 dark:before:to-indigo-900/30 before:-z-10
      after:absolute after:inset-[1px] after:rounded-[calc(0.75rem-1px)] after:bg-white dark:after:bg-gray-900 after:-z-10">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Choose Your Protection Level</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-full shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Self-Service Platform</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose between three feature-rich plans:
                </p>
                <ul className="text-sm space-y-1.5 list-disc ml-4">
                  <li><span className="font-medium">Basic</span>: Free with limited searches</li>
                  <li><span className="font-medium">Professional</span>: 50 searches/month, 10 scheduled searches</li>
                  <li><span className="font-medium">Business</span>: Unlimited searches, advanced protection tools</li>
                </ul>
                <div className="mt-4">
                  <Button size="sm" asChild>
                    <Link to="/#pricing">View Plans</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-full shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Fully Managed Service</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Ideal for agencies, large brands and professional creators with our comprehensive managed monitoring service.
                </p>
                <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Enterprise managed service</span>
                    <Button size="sm" asChild>
                      <a href="mailto:contact@influenceguard.com">Contact Sales</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
