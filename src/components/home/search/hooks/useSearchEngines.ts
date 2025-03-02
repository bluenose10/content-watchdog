
import { useState, useEffect } from "react";
import { getAvailableSearchEngines } from "../searchService";

export function useSearchEngines() {
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

  return { availableEngines };
}
