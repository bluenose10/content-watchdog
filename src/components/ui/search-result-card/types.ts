
export interface SearchResult {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  source: string;
  matchLevel: string;
  date: string;
  type?: string;
  snippet?: string;
}

export interface SearchResultCardProps {
  result: SearchResult;
  isPremium?: boolean;
  isFreePreview?: boolean;
  onUpgrade?: () => void;
}
