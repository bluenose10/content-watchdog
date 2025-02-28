
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export function MissionCard() {
  return (
    <Card className="relative overflow-hidden glass-card transition-all duration-300 hover:shadow-lg
      before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-purple-200 before:via-blue-200 before:to-indigo-200 dark:before:from-purple-900/30 dark:before:via-blue-900/30 dark:before:to-indigo-900/30 before:-z-10
      after:absolute after:inset-[1px] after:rounded-[calc(0.75rem-1px)] after:bg-white dark:after:bg-gray-900 after:-z-10">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Our Mission
        </h3>
        <p className="mb-4 text-muted-foreground">
          We started Influence Guard with a simple mission: to give content creators and businesses complete control over how their work is used online.
        </p>
        <p className="text-muted-foreground">
          In today's digital landscape, protecting your intellectual property is more challenging than ever. Our team of experts combines advanced technology with personalized service to ensure your content remains yours.
        </p>
      </CardContent>
    </Card>
  );
}
