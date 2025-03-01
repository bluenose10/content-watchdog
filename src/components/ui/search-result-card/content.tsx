
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { type SearchResult } from "./types";
import { cleanSupabaseUrls, getMatchColorStyles, formatSafeDate } from "./utils";
import { getSocialMediaInfo } from "./social-media-info";

interface SearchResultContentProps {
  result: SearchResult;
  isPremium: boolean;
  isFreePreview: boolean;
}

export function SearchResultContent({ result, isPremium, isFreePreview }: SearchResultContentProps) {
  const { title, url, source, matchLevel, date, type = "website", snippet } = result;
  
  // Ensure we have valid input data
  const validTitle = title || "Untitled Content";
  const validUrl = url || "#";
  const validSource = source || "Unknown Source";
  const validType = type || "website";
  
  const cleanTitle = cleanSupabaseUrls(validTitle, "title", validSource);
  const cleanUrl = cleanSupabaseUrls(validUrl, "url", validSource);
  const cleanSource = cleanSupabaseUrls(validSource, "source");
  
  const truncatedTitle = cleanTitle.length > 60 ? cleanTitle.substring(0, 60) + '...' : cleanTitle;
  
  const safeMatchLevel = matchLevel || 'Medium';
  const matchColor = getMatchColorStyles(safeMatchLevel);
  
  const formattedDate = formatSafeDate(date);
  const socialMedia = getSocialMediaInfo(cleanSource, validType);
  
  return (
    <div className="flex items-center p-4">
      <div className="mr-3">
        <div className={`rounded-full p-2 ${socialMedia.color} bg-gray-100 dark:bg-gray-800`}>
          <socialMedia.Icon size={20} />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium truncate" title={cleanTitle}>
            {truncatedTitle}
          </h3>
          <Badge className={`ml-2 shrink-0 ${matchColor.badge}`}>
            {safeMatchLevel}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <span className="font-medium truncate">{cleanSource}</span>
          <span className="mx-1">•</span>
          <span>{formattedDate}</span>
        </div>
        
        {(isPremium || isFreePreview) && snippet && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={snippet}>
            {snippet}
          </p>
        )}
        
        {(isPremium || isFreePreview) ? (
          <p className="text-xs truncate text-gray-600 dark:text-gray-300 mt-1" title={cleanUrl}>
            {cleanUrl}
          </p>
        ) : (
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Upgrade to view full details
          </p>
        )}
      </div>
      
      <div className="ml-2 shrink-0">
        <ArrowRight className={`h-5 w-5 ${matchColor.text}`} />
      </div>
    </div>
  );
}
