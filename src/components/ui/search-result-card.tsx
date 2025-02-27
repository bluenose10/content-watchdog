
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
  
  // Default tech-related image from Unsplash
  const defaultImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400&q=80";
  
  // Start with default image, override with thumbnail if exists
  const [currentImage, setCurrentImage] = useState<string>(thumbnail || defaultImage);
  
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

  // Simple error handler that goes directly to placeholder
  const handleImageError = () => {
    console.log("Image failed to load:", currentImage);
    setCurrentImage("/placeholder.svg");
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <div className="overflow-hidden" style={{ height: "225px", backgroundColor: "#f1f5f9" }}>
          {/* Background color ensures visibility even during image loading */}
          <img
            src={currentImage}
            alt={title || "Search result"}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            style={{ aspectRatio: "600/400" }}
            onError={handleImageError}
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
        {!isPremium && !isFreePreview && (
          <Badge 
            className="absolute left-2 top-2 bg-purple-500 text-white cursor-pointer"
            onClick={onUpgrade}
          >
            Upgrade to View
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
