
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { getAvailableSearchEngines } from "@/lib/search";

export function SearchHeader() {
  const [availableEngines, setAvailableEngines] = useState<string[]>([]);

  useEffect(() => {
    // Get available search engines
    setAvailableEngines(getAvailableSearchEngines());
    
    // Refresh the list every 30 seconds
    const interval = setInterval(() => {
      setAvailableEngines(getAvailableSearchEngines());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold mb-2">Content Search</h2>
      <p className="text-sm text-muted-foreground">
        Find and protect your content
      </p>
      
      {availableEngines.length > 0 && (
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
      )}
    </div>
  );
}
