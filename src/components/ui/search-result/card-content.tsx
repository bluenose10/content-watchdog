
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { SocialMediaInfo, getSocialMediaInfo } from "./social-media-info";
import { truncateText } from "@/lib/utils";

interface CardContentProps {
  cleanTitle: string;
  cleanSource: string;
  cleanUrl: string;
  date: string;
  matchColor: {
    badge: string;
    text: string;
    border: string;
    hover: string;
    shadow: string;
  };
  safeMatchLevel: string;
  snippet?: string;
  isPremium: boolean;
  isFreePreview: boolean;
  socialMedia?: SocialMediaInfo;
  type?: string;
}

export function CardContent({
  cleanTitle,
  cleanSource,
  cleanUrl,
  date,
  matchColor,
  safeMatchLevel,
  snippet,
  isPremium,
  isFreePreview,
  socialMedia,
  type = 'website'
}: CardContentProps) {
  const truncatedTitle = cleanTitle.length > 60 ? cleanTitle.substring(0, 60) + '...' : cleanTitle;
  
  const formattedDate = (() => {
    try {
      return date ? formatDate(date) : 'Recently';
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'Recently';
    }
  })();

  // If socialMedia is not provided, generate it from the source and type
  const mediaInfo = socialMedia || getSocialMediaInfo(cleanSource, type);

  return (
    <div className="flex items-center p-4">
      <div className="mr-3">
        <div className={`rounded-full p-2 ${mediaInfo.color} bg-gray-100 dark:bg-gray-800`}>
          <mediaInfo.Icon size={20} />
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
