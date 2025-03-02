
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface SearchEnginesProps {
  availableEngines: string[];
}

export function SearchEngines({ availableEngines }: SearchEnginesProps) {
  if (availableEngines.length === 0) return null;
  
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-2">
      <div className="text-xs text-muted-foreground flex items-center">
        <Search className="h-3 w-3 mr-1" />
        Powered by:
      </div>
      {availableEngines.map(engine => (
        <Badge 
          key={engine} 
          variant="outline" 
          className="text-xs capitalize"
        >
          {engine}
        </Badge>
      ))}
    </div>
  );
}
