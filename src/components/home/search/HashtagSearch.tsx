
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface HashtagSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  isAuthenticated?: boolean;
}

export function HashtagSearch({ onSearch, isLoading = false, isAuthenticated = false }: HashtagSearchProps) {
  const [hashtagQuery, setHashtagQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashtagQuery.trim()) {
      onSearch(hashtagQuery.trim());
    }
  };

  // Show different UI based on authentication status
  if (isAuthenticated) {
    return (
      <form onSubmit={handleSearch}>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input 
            placeholder="Enter a hashtag" 
            value={hashtagQuery}
            onChange={(e) => setHashtagQuery(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            className="whitespace-nowrap cursor-pointer" 
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
            {!isLoading && <Search className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Search for content using hashtags.
        </p>
      </form>
    );
  }

  // For non-authenticated users
  return (
    <div>
      <div className="flex justify-center">
        <Button 
          type="button" 
          className="whitespace-nowrap cursor-pointer bg-purple-600 hover:bg-purple-700" 
          asChild
        >
          <Link to="/signup">
            Sign Up
            <UserPlus className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        Sign up for a free account to access our basic search features. Our free plan includes 3 searches per month.
      </p>
    </div>
  );
}
