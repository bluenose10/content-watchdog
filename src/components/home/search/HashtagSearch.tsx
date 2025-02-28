
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface HashtagSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function HashtagSearch({ onSearch, isLoading = false }: HashtagSearchProps) {
  const [hashtagQuery, setHashtagQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashtagQuery.trim()) {
      onSearch(hashtagQuery.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input 
          placeholder="Enter a hashtag" 
          value={hashtagQuery}
          onChange={(e) => setHashtagQuery(e.target.value)}
          required
        />
        <Button type="submit" className="whitespace-nowrap cursor-pointer" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Sign up for a free account to access our basic search features. Our free plan includes 3 searches per month.
      </p>
    </form>
  );
}
