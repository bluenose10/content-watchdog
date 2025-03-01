
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { TextSearchParams } from "@/lib/db-types";
import { handleTextSearch } from "../searchService";
import { handlePreSearchChecks, handlePermissionError } from "./common-handlers";

type HashtagSearchProps = {
  query: string;
  user: User | null;
  accessLevel: any;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  navigate: (path: string) => void;
  params?: TextSearchParams;
};

export const executeHashtagSearch = async ({
  query,
  user,
  accessLevel,
  setIsLoading,
  setError,
  navigate,
  params
}: HashtagSearchProps): Promise<void> => {
  return handlePreSearchChecks(
    { user, accessLevel, setIsLoading, setError, navigate },
    async () => {
      console.log("Hashtag search with query:", query, "and params:", params);
      
      try {
        const searchId = await handleTextSearch(query, "hashtag", user, params);
        // Use the searchId directly in the URL for results
        navigate(`/results?id=${searchId}`);
      } catch (error: any) {
        console.error("Hashtag search error:", error);
        
        // Handle permission errors more gracefully
        if (handlePermissionError(error, query, "hashtag", navigate)) {
          return;
        }
        
        // For other errors, show the error message
        setError("There was a problem with your hashtag search. Please try again.");
        
        toast({
          title: "Search failed",
          description: error instanceof Error ? error.message : "There was a problem with your search. Please try again.",
          variant: "destructive",
        });
      }
    }
  );
};
