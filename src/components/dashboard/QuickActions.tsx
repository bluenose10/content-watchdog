
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, FileClock, Home, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <Card className="glass-card transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/search">
              <Search className="mr-2 h-4 w-4" />
              New Content Search
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/monitoring">
              <FileClock className="mr-2 h-4 w-4" />
              Set Up Monitoring
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/analytics">
              <BarChart className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/account">
              <User className="mr-2 h-4 w-4" />
              Account Settings
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
