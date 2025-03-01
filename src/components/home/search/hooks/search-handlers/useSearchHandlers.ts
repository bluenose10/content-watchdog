
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { AccessLevel } from "@/hooks/useProtectedRoute";
import { useNameSearch } from "./useNameSearch";
import { useHashtagSearch } from "./useHashtagSearch";
import { useImageSearch } from "./useImageSearch";

export function useSearchHandlers(user: User | null, accessLevel: AccessLevel) {
  const { handleNameSearch, isLoading: nameIsLoading, error: nameError } = useNameSearch(user, accessLevel);
  const { handleHashtagSearch, isLoading: hashtagIsLoading, error: hashtagError } = useHashtagSearch(user, accessLevel);
  const { handleImageSearchSubmit, isLoading: imageIsLoading, error: imageError } = useImageSearch(user, accessLevel);
  
  // Combine errors and loading states from all hooks
  const isLoading = nameIsLoading || hashtagIsLoading || imageIsLoading;
  const [error, setError] = useState<string | null>(null);
  
  // Update the combined error when any individual error changes
  useState(() => {
    const currentError = nameError || hashtagError || imageError;
    if (currentError !== error) {
      setError(currentError);
    }
  });

  return {
    handleNameSearch,
    handleHashtagSearch,
    handleImageSearchSubmit,
    isLoading,
    error,
    setError
  };
}
