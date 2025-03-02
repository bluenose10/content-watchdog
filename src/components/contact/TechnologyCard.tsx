
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export function TechnologyCard() {
  return (
    <Card className="relative overflow-hidden glass-card transition-all duration-300 hover:shadow-lg
      before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-purple-200 before:via-blue-200 before:to-indigo-200 dark:before:from-purple-900/30 dark:before:via-blue-900/30 dark:before:to-indigo-900/30 before:-z-10
      after:absolute after:inset-[1px] after:rounded-[calc(0.75rem-1px)] after:bg-white dark:after:bg-gray-900 after:-z-10">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Our Technology
        </h3>
        <p className="mb-4 text-muted-foreground">
          Founded by a team of content protection experts and technology innovators, Influence Guard brings together decades of experience in digital rights management, intellectual property law, and artificial intelligence.
        </p>
        <p className="text-muted-foreground">
          Our proprietary scanning technology processes over 1 million pieces of content daily, comparing visual fingerprints and text patterns to detect even slightly modified copies of your work.
        </p>
      </CardContent>
    </Card>
  );
}
