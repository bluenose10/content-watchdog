
import { useState } from "react";

export interface SearchState {
  isLoading: boolean;
  results: any[];
  query: string;
  searchDate: string;
  totalResults: number;
}

export interface SearchStateActions {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setSearchDate: React.Dispatch<React.SetStateAction<string>>;
  setTotalResults: React.Dispatch<React.SetStateAction<number>>;
}

export function useSearchState(): [SearchState, SearchStateActions] {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("Today");
  const [totalResults, setTotalResults] = useState<number>(0);

  const state: SearchState = {
    isLoading,
    results,
    query,
    searchDate,
    totalResults
  };

  const actions: SearchStateActions = {
    setIsLoading,
    setResults,
    setQuery,
    setSearchDate,
    setTotalResults
  };

  return [state, actions];
}
