
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileClock, FileCheck, Search, User, Shield, Fingerprint, AlertTriangle } from "lucide-react";
import { ActionButton } from "./ActionButton";

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
          <ActionButton 
            to="/search"
            icon={Search}
            title="New Search"
            description="Find your content"
          />
          <ActionButton 
            to="/monitoring"
            icon={FileClock}
            title="Monitoring"
            description="Set up alerts"
          />
          <ActionButton 
            to="/analytics"
            icon={BarChart3}
            title="Analytics"
            description="View insights"
          />
          <ActionButton 
            to="/content-authenticity"
            icon={Fingerprint}
            title="Authenticity"
            description="Verify content"
          />
          <ActionButton 
            to="/plagiarism-checker"
            icon={FileCheck}
            title="Plagiarism"
            description="Check content"
          />
          <ActionButton 
            to="/protection?tab=takedowns"
            icon={AlertTriangle}
            title="DMCA Filing"
            description="Submit takedowns"
            variant="danger"
          />
          <ActionButton 
            to="/protection"
            icon={Shield}
            title="Protection"
            description="Manage takedowns"
          />
          <ActionButton 
            to="/settings"
            icon={User}
            title="Account"
            description="Manage settings"
          />
        </div>
      </CardContent>
    </Card>
  );
}
