
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SearchTabs } from "./search/SearchTabs";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { ErrorDisplay } from "./search/ErrorDisplay";
import { SearchHeader } from "./search/SearchHeader";
import { useSearchHandlers } from "./search/SearchHandlers";

export function ContentSearchSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessLevel } = useProtectedRoute(false);

  // Use our custom hook to get the search handlers
  const {
    handleNameSearch,
    handleHashtagSearch,
    handleImageSearchSubmit
  } = useSearchHandlers({
    user,
    accessLevel,
    setIsLoading,
    setError,
    navigate
  });

  return (
    <section id="content-search-section" className="h-full">
      <div className="container px-4 md:px-6 h-full">
        <SearchHeader />

        <ErrorDisplay error={error} />

        <Card className="glass-card">
          <CardContent className="p-4 sm:p-6">
            <SearchTabs
              onNameSearch={handleNameSearch}
              onHashtagSearch={handleHashtagSearch}
              onImageSearch={handleImageSearchSubmit}
              isLoading={isLoading}
              isAuthenticated={!!user} // Pass actual authentication state
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
