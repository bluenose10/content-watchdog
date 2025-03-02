
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
