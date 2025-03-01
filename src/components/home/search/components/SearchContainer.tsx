
import { Card, CardContent } from "@/components/ui/card";
import { SearchTabs } from "../SearchTabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

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
  const [activeTab, setActiveTab] = useState<string>("name");
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-4 sm:p-6">
        <SearchTabs
          onNameSearch={onNameSearch}
          onHashtagSearch={onHashtagSearch}
          onImageSearch={onImageSearch}
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </CardContent>
    </Card>
  );
}
