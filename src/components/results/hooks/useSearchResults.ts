
import { useEffect } from "react";
import { useSearchState } from "./useSearchState";
import { useFetchResults } from "./useFetchResults";

export function useSearchResults(id: string | null, isReady: boolean) {
  const [state, stateActions] = useSearchState();
  const { fetchResults } = useFetchResults({ id, isReady, stateActions });

  useEffect(() => {
    if (isReady) {
      fetchResults();
    }
  }, [isReady, id]);

  return { 
    isLoading: state.isLoading, 
    results: state.results, 
    query: state.query, 
    searchDate: state.searchDate, 
    totalResults: state.totalResults
  };
}
