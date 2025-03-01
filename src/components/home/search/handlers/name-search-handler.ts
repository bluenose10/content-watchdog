
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { TextSearchParams } from "@/lib/db-types";
import { handleTextSearch } from "../searchService";
import { handlePreSearchChecks, handlePermissionError } from "./common-handlers";

type NameSearchProps = {
  query: string;
  user: User | null;
  accessLevel: any;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  navigate: (path: string) => void;
  params?: TextSearchParams;
};

export const executeNameSearch = async ({
  query,
  user,
  accessLevel,
  setIsLoading,
  setError,
  navigate,
  params
}: NameSearchProps): Promise<void> => {
  return handlePreSearchChecks(
    { user, accessLevel, setIsLoading, setError, navigate },
    async () => {
      console.log("Name search with query:", query, "and params:", params);
      
      try {
        const searchId = await handleTextSearch(query, "name", user, params);
        // Use the searchId directly in the URL for results
        navigate(`/results?id=${searchId}`);
      } catch (error: any) {
        console.error("Name search error:", error);
        
        // Handle permission errors more gracefully
        if (handlePermissionError(error, query, "name", navigate)) {
          return;
        }
        
        // For other errors, show the error message
        setError("There was a problem with your search. Please try again.");
        
        toast({
          title: "Search failed",
          description: error instanceof Error ? error.message : "There was a problem with your search. Please try again.",
          variant: "destructive",
        });
      }
    }
  );
};
