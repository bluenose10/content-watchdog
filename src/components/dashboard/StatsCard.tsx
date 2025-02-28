
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-purple-100/50 dark:border-purple-800/30 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-950/40">
      <CardHeader className="pb-2 pt-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="rounded-full p-1.5 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          <div className="text-2xl font-bold text-gradient">{value}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
