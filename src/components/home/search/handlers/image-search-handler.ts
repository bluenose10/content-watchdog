
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import { ImageSearchParams } from "@/lib/db-types";
import { handleImageSearch } from "../searchService";
import { handlePreSearchChecks, handlePermissionError } from "./common-handlers";

type ImageSearchProps = {
  file: File;
  user: User | null;
  accessLevel: any;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  navigate: (path: string) => void;
  params?: ImageSearchParams;
};

export const executeImageSearch = async ({
  file,
  user,
  accessLevel,
  setIsLoading,
  setError,
  navigate,
  params
}: ImageSearchProps): Promise<void> => {
  return handlePreSearchChecks(
    { user, accessLevel, setIsLoading, setError, navigate },
    async () => {
      console.log("Image search with file:", file.name, "and params:", params);
      
      try {
        const searchId = await handleImageSearch(file, user, params);
        // Use the searchId directly in the URL for results
        navigate(`/results?id=${searchId}`);
      } catch (error: any) {
        console.error("Image search error:", error);
        
        // Handle permission errors more gracefully
        if (handlePermissionError(error, "", "image", navigate)) {
          return;
        }
        
        // For other errors, show the error message
        setError("There was a problem with your image search. Please try again.");
        
        toast({
          title: "Search failed",
          description: error instanceof Error ? error.message : "There was a problem with your search. Please try again.",
          variant: "destructive",
        });
      }
    }
  );
};
