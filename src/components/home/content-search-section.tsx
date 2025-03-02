
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { SearchHeader } from "./search/components/SearchHeader";
import { ErrorDisplay } from "./search/components/ErrorDisplay";
import { SearchContainer } from "./search/components/SearchContainer";
import { useSearchHandlers } from "./search/hooks/useSearchHandlers";
import { useSearchEngines } from "./search/hooks/useSearchEngines";

export function ContentSearchSection() {
  const { user } = useAuth();
  const { accessLevel } = useProtectedRoute(false);
  const { availableEngines } = useSearchEngines();
  const { 
    handleNameSearch, 
    handleHashtagSearch, 
    handleImageSearchSubmit, 
    isLoading, 
    error 
  } = useSearchHandlers(user, accessLevel);

  return (
    <section id="content-search-section" className="h-full">
      <div className="container px-4 md:px-6 h-full">
        <SearchHeader availableEngines={availableEngines} />
        
        <ErrorDisplay error={error} />

        <SearchContainer
          onNameSearch={handleNameSearch}
          onHashtagSearch={handleHashtagSearch}
          onImageSearch={handleImageSearchSubmit}
          isLoading={isLoading}
          isAuthenticated={!!user}
        />
      </div>
    </section>
  );
}
