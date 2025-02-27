
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate, getMatchLevelColor } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Badge } from "./badge";
import { useState } from "react";

interface SearchResultCardProps {
  result: {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    source: string;
    matchLevel: string;
    date: string;
  };
  isPremium?: boolean;
  isFreePreview?: boolean;
  onUpgrade?: () => void;
}

export function SearchResultCard({
  result,
  isPremium = false,
  isFreePreview = false,
  onUpgrade,
}: SearchResultCardProps) {
  const { title, url, thumbnail, source, matchLevel, date } = result;
  const [imageError, setImageError] = useState(false);
  
  // Use the thumbnail URL if provided, or attempt to use an image from the source website
  // If thumbnail is unavailable, we'll try to construct a URL to an image from the source domain
  const determineThumbnailUrl = () => {
    // If we already know the image had an error, use placeholder
    if (imageError) {
      return '/placeholder.svg';
    }
    
    // If thumbnail is provided and not empty, use it
    if (thumbnail) {
      return thumbnail;
    }
    
    // Try to extract domain from the URL to create a potential image path
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      // Try to use a favicon or og:image that might exist on the domain
      return `https://${domain}/favicon.ico`;
    } catch (e) {
      // If URL parsing fails, use placeholder
      return '/placeholder.svg';
    }
  };
  
  // Get thumbnail URL 
  const imageSrc = determineThumbnailUrl();
  
  // Truncate long titles
  const truncatedTitle = title.length > 60 ? title.substring(0, 60) + '...' : title;
  
  // Ensure matchLevel is a valid string before using it
  const safeMatchLevel = matchLevel || 'Medium';
  const matchLevelColor = getMatchLevelColor(safeMatchLevel);
  
  // Safely format the date or provide a fallback
  const formattedDate = (() => {
    try {
      return date ? formatDate(date) : 'Recently';
    } catch (error) {
      return 'Recently';
    }
  })();
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <div className="overflow-hidden" style={{ height: "225px" }}>
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            style={{ aspectRatio: "600/400" }}
            onError={(e) => {
              // If the main image or favicon fails, try an alternative approach
              setImageError(true);
              
              // Try to use a generic image from the domain
              const fallbackImg = new Image();
              const urlObj = new URL(url);
              fallbackImg.src = `https://${urlObj.hostname}/logo.png`;
              
              fallbackImg.onload = () => {
                (e.target as HTMLImageElement).src = fallbackImg.src;
              };
              
              fallbackImg.onerror = () => {
                // If all attempts fail, use placeholder
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              };
            }}
          />
        </div>
        <Badge 
          className={`absolute right-2 top-2 ${matchLevelColor} text-white`}
        >
          {safeMatchLevel} Match
        </Badge>
        {isFreePreview && (
          <Badge 
            className="absolute left-2 top-2 bg-blue-500 text-white"
          >
            Free Preview
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold" title={title}>{truncatedTitle}</h3>
        <p className="text-sm text-muted-foreground">
          Found on {source} • {formattedDate}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        {isPremium || isFreePreview ? (
          <p className="text-sm truncate" title={url}>{url}</p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm">Full details available with premium plan</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isPremium || isFreePreview ? (
          <Button asChild variant="outline" size="sm" className="w-full gap-1">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Visit Site
            </a>
          </Button>
        ) : (
          <Button 
            onClick={onUpgrade} 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            Upgrade to View
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
