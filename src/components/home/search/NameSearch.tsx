
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface NameSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function NameSearch({ onSearch, isLoading = false }: NameSearchProps) {
  const [nameQuery, setNameQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameQuery.trim()) {
      onSearch(nameQuery.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input 
          placeholder="Enter your name or username" 
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          required
        />
        <Button type="submit" className="whitespace-nowrap cursor-pointer" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        You can try a free preview without signing up or needing an account - see what we find online, you might be surprised.
      </p>
    </form>
  );
}
