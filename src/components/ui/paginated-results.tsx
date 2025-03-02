
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchResultCard } from "@/components/ui/search-result-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AccessLevel } from "@/hooks/useProtectedRoute";

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
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  // Get result limit based on access level
  const getResultLimit = () => {
    switch (accessLevel) {
      case AccessLevel.ADMIN:
        return results.length; // Admin users should see all results
      case AccessLevel.PREMIUM:
        return results.length; // Premium users can see all results
      case AccessLevel.BASIC:
        return 3; // Free users can only see 3 results
      case AccessLevel.ANONYMOUS:
      default:
        return 1; // Anonymous users see only 1 result
    }
  };

  const resultLimit = getResultLimit();
  const displayedResults = currentResults.slice(0, resultLimit);
  const hasHiddenResults = currentResults.length > resultLimit;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        {displayedResults.map((result, index) => (
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
          />
        ))}
      </div>
      
      {hasHiddenResults && accessLevel !== AccessLevel.PREMIUM && accessLevel !== AccessLevel.ADMIN && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border text-center">
          <h4 className="font-medium mb-2">Additional Results Available</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Upgrade to view all {results.length} results from your search.
          </p>
          <Button onClick={onUpgrade} variant="default" size="sm">
            Upgrade Now
          </Button>
        </div>
      )}

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
