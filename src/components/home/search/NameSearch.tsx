
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface NameSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function NameSearch({ onSearch, isLoading = false }: NameSearchProps) {
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
