
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useSearchState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    toast
  };
}
