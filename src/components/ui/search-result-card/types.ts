
export interface SearchResult {
  id: string;
  title: string;
  url: string;
  thumbnail?: string; // Make thumbnail optional since we're not showing it
  source: string;
  matchLevel: string;
  date: string;
  type?: string;
  snippet?: string;
}

export interface SearchResultCardProps {
  result: SearchResult;
}
