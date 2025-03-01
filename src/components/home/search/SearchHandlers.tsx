
import { User } from "@supabase/supabase-js";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { TextSearchParams, ImageSearchParams } from "@/lib/db-types";
import { executeNameSearch } from "./handlers/name-search-handler";
import { executeHashtagSearch } from "./handlers/hashtag-search-handler";
import { executeImageSearch } from "./handlers/image-search-handler";

type SearchHandlersProps = {
  user: User | null;
  accessLevel: AccessLevel;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  navigate: (path: string) => void;
};

export const useSearchHandlers = ({
  user,
  accessLevel,
  setIsLoading,
  setError,
  navigate,
}: SearchHandlersProps) => {
  
  const handleNameSearch = async (query: string, params?: TextSearchParams) => {
    return executeNameSearch({
      query,
      user,
      accessLevel,
      setIsLoading,
      setError,
      navigate,
      params
    });
  };

  const handleHashtagSearch = async (query: string, params?: TextSearchParams) => {
    return executeHashtagSearch({
      query,
      user,
      accessLevel,
      setIsLoading,
      setError,
      navigate,
      params
    });
  };

  const handleImageSearchSubmit = async (file: File, params?: ImageSearchParams) => {
    return executeImageSearch({
      file,
      user,
      accessLevel,
      setIsLoading,
      setError,
      navigate,
      params
    });
  };

  return {
    handleNameSearch,
    handleHashtagSearch,
    handleImageSearchSubmit
  };
};
