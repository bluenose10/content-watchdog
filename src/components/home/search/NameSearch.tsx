
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface NameSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function NameSearch({ onSearch, isLoading = false }: NameSearchProps) {
  const [nameQuery, setNameQuery] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input 
          placeholder="Enter your name or username" 
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          disabled={true}
          className="bg-slate-50 dark:bg-slate-800/50"
        />
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
      <p className="text-sm text-muted-foreground mt-2">
        Sign up for a free account to access our basic search features. Our free plan includes 3 searches per month.
      </p>
    </div>
  );
}
