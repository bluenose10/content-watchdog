
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function UpgradeCard() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Get unlimited searches and advanced features
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-gradient font-semibold text-lg mb-2">Protect Your Content From Unauthorized Use</p>
            <ul className="space-y-1">
              <li className="flex items-center text-sm">
                <Shield className="mr-2 h-4 w-4 text-green-500" />
                Unlimited search results
              </li>
              <li className="flex items-center text-sm">
                <Shield className="mr-2 h-4 w-4 text-green-500" />
                Advanced content monitoring
              </li>
              <li className="flex items-center text-sm">
                <Shield className="mr-2 h-4 w-4 text-green-500" />
                10 automated monitoring sessions
              </li>
              <li className="flex items-center text-sm">
                <Shield className="mr-2 h-4 w-4 text-green-500" />
                Export results in multiple formats
              </li>
            </ul>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold mb-2">$49.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            <Button asChild className="button-animation">
              <Link to="/#pricing">
                Upgrade Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
