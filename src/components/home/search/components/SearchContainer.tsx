
import { Card, CardContent } from "@/components/ui/card";
import { SearchTabs } from "../SearchTabs";

interface SearchContainerProps {
  onNameSearch: (query: string, params?: any) => Promise<void>;
  onHashtagSearch: (query: string, params?: any) => Promise<void>;
  onImageSearch: (file: File, params?: any) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function SearchContainer({
  onNameSearch,
  onHashtagSearch,
  onImageSearch,
  isLoading,
  isAuthenticated
}: SearchContainerProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-4 sm:p-6">
        <SearchTabs
          onNameSearch={onNameSearch}
          onHashtagSearch={onHashtagSearch}
          onImageSearch={onImageSearch}
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
        />
      </CardContent>
    </Card>
  );
}
