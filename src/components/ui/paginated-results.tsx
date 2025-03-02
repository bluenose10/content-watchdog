
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchResultCard } from "@/components/ui/search-result-card";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { toast } from "sonner";

interface PaginatedResultsProps {
  results: any[];
  accessLevel: AccessLevel;
  itemsPerPage?: number;
  onUpgrade: () => void;
}

export function PaginatedResults({
  results,
  accessLevel,
  itemsPerPage = 10,
  onUpgrade,
}: PaginatedResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFallbackData, setIsFallbackData] = useState(false);

  useEffect(() => {
    // Check if we're using fallback data by looking for the fallback pattern in IDs
    if (results && results.length > 0) {
      const hasFallbackIds = results.some(result => 
        result.id?.toString().includes('fallback') || 
        result.id?.toString().includes('Sample') ||
        result.title?.includes('Sample') ||
        (result.id?.toString().startsWith('result-') && !result.id?.toString().includes('google'))
      );
      
      if (hasFallbackIds) {
        setIsFallbackData(true);
        console.log("Warning: Using fallback/sample search results");
        
        // Fix: Use toast function correctly
        toast("We're showing sample data because the Google API connection failed. Check the console for details.");
      } else {
        setIsFallbackData(false);
        console.log("Using real API search results");
        
        // Fix: Use toast function correctly
        toast("Showing real search results from Google.");
      }
    }
  }, [results]);

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results found</p>
      </div>
    );
  }

  // Calculate pagination values
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, results.length);
  const currentResults = results.slice(startIndex, endIndex);

  // Get result limit based on access level
  const getResultLimit = () => {
    switch (accessLevel) {
      case AccessLevel.PREMIUM:
        return 20; // Pro users can see all 20 results unblurred
      case AccessLevel.BASIC:
        return 5; // Registered users can see 5 unblurred results
      case AccessLevel.ANONYMOUS:
      default:
        return 0; // Anonymous users see 0 unlocked results (all blurred)
    }
  };

  // Check if a result should be premium (unblurred)
  const isPremium = (index: number) => {
    const actualIndex = startIndex + index;
    return actualIndex < getResultLimit();
  };

  // Check if a result is a free preview for anonymous users
  const isFreePreview = (index: number) => {
    const actualIndex = startIndex + index;
    return accessLevel === AccessLevel.ANONYMOUS && actualIndex < 2;
  };

  return (
    <div className="space-y-6">
      {isFallbackData && (
        <div className="p-3 mb-4 border rounded-md bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm text-yellow-800 dark:text-yellow-300">
            Using sample results. There was an issue connecting to the Google search service. 
            To fix this, make sure your Google API key and CSE ID are correctly set.
          </span>
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        {currentResults.map((result, index) => (
          <SearchResultCard
            key={result.id || `result-${startIndex + index}`}
            result={{
              id: result.id || `result-${startIndex + index}`,
              title: result.title,
              url: result.url,
              thumbnail: result.thumbnail,
              source: result.source,
              matchLevel: result.match_level,
              date: result.found_at,
              type: result.type,
              snippet: result.snippet,
            }}
            isPremium={isPremium(index)}
            isFreePreview={isFreePreview(index)}
            onUpgrade={onUpgrade}
          />
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm text-muted-foreground px-2">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
