
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ArrowDown, ArrowUp, BarChart3 } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  description?: string;
  change?: number;  // Added this property
  duration?: string; // Added this property
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon = BarChart3, 
  description, 
  change, 
  duration 
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
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
          {(change || description) && (
            <div className="flex items-center mt-2">
              {change !== undefined && (
                <span className={`inline-flex items-center mr-2 text-xs font-medium ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 
                  isNegative ? 'text-red-600 dark:text-red-400' : 
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {isPositive && <ArrowUp className="w-3 h-3 mr-1" />}
                  {isNegative && <ArrowDown className="w-3 h-3 mr-1" />}
                  {isPositive ? '+' : ''}{change}%
                </span>
              )}
              <p className="text-xs text-muted-foreground">
                {description || duration || ''}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
