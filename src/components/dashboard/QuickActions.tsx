
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileClock, FileCheck, Search, User, Shield, Fingerprint } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-purple-100/50 dark:border-purple-800/30 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-950/40">
      <CardHeader className="border-b border-purple-100/30 dark:border-purple-900/30 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/30 dark:to-blue-900/30">
        <CardTitle className="text-xl font-semibold text-gradient">Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and actions
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" className="justify-start h-auto py-3 px-4 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 hover:from-indigo-500/10 hover:to-blue-500/10" asChild>
            <Link to="/search">
              <Search className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">New Search</span>
                <span className="text-xs text-muted-foreground">Find your content</span>
              </div>
            </Link>
          </Button>
          <Button variant="secondary" className="justify-start h-auto py-3 px-4 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 hover:from-indigo-500/10 hover:to-blue-500/10" asChild>
            <Link to="/monitoring">
              <FileClock className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Monitoring</span>
                <span className="text-xs text-muted-foreground">Set up alerts</span>
              </div>
            </Link>
          </Button>
          <Button variant="secondary" className="justify-start h-auto py-3 px-4 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 hover:from-indigo-500/10 hover:to-blue-500/10" asChild>
            <Link to="/analytics">
              <BarChart3 className="mr-2 h-4 w-4 text-violet-600 dark:text-violet-400" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Analytics</span>
                <span className="text-xs text-muted-foreground">View insights</span>
              </div>
            </Link>
          </Button>
          <Button variant="secondary" className="justify-start h-auto py-3 px-4 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 hover:from-indigo-500/10 hover:to-blue-500/10" asChild>
            <Link to="/content-authenticity">
              <Fingerprint className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Authenticity</span>
                <span className="text-xs text-muted-foreground">Verify content</span>
              </div>
            </Link>
          </Button>
          <Button variant="secondary" className="justify-start h-auto py-3 px-4 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 hover:from-indigo-500/10 hover:to-blue-500/10" asChild>
            <Link to="/plagiarism-checker">
              <FileCheck className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Plagiarism</span>
                <span className="text-xs text-muted-foreground">Check content</span>
              </div>
            </Link>
          </Button>
          <Button variant="secondary" className="justify-start h-auto py-3 px-4 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 hover:from-indigo-500/10 hover:to-blue-500/10" asChild>
            <Link to="/protection">
              <Shield className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Protection</span>
                <span className="text-xs text-muted-foreground">Manage takedowns</span>
              </div>
            </Link>
          </Button>
          <Button variant="secondary" className="justify-start h-auto py-3 px-4 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 hover:from-indigo-500/10 hover:to-blue-500/10" asChild>
            <Link to="/settings">
              <User className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Account</span>
                <span className="text-xs text-muted-foreground">Manage settings</span>
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
