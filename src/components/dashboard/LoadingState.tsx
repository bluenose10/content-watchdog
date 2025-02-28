
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col justify-center items-center py-12 space-y-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-purple-200 dark:border-purple-800 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-gradient mb-1">Loading dashboard</h3>
        <p className="text-sm text-muted-foreground">Preparing your content analytics...</p>
      </div>
    </div>
  );
}
