
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate, getMatchLevelColor } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Badge } from "./badge";
import { useState, useEffect } from "react";

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
  const [imageSrc, setImageSrc] = useState(thumbnail || '/placeholder.svg');
  const [imageError, setImageError] = useState(false);
  
  // When the component mounts or the URL changes, try to find a better image
  useEffect(() => {
    // Skip if we already have a thumbnail or if there was a previous error
    if (thumbnail || imageError) return;
    
    const tryFindBetterImage = async () => {
      try {
        // Extract domain from URL
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        
        // Create an array of potential image URLs to try
        const potentialImages = [
          `https://${domain}/image.jpg`,
          `https://${domain}/images/logo.png`,
          `https://${domain}/wp-content/uploads/logo.png`,
          `https://${domain}/assets/images/banner.jpg`,
          `https://${domain}/logo.png`,
          // Meta images often are better quality than favicons
          `https://${domain}/wp-content/uploads/og-image.jpg`,
          `https://${domain}/assets/img/og-image.jpg`,
          // Try the favicon last as it's usually small
          `https://${domain}/favicon.ico`
        ];
        
        // Try each image URL until one works
        for (const imgUrl of potentialImages) {
          try {
            const img = new Image();
            img.src = imgUrl;
            
            // Use a promise to wait for the image to load or fail
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              // Set a timeout in case the image takes too long
              setTimeout(reject, 1000);
            });
            
            // If we get here, the image loaded successfully
            setImageSrc(imgUrl);
            return;
          } catch (err) {
            // Image failed to load, try the next one
            continue;
          }
        }
        
        // If all attempts fail, use placeholder
        throw new Error("No images found");
      } catch (err) {
        // If there's any error in the process, use placeholder
        setImageError(true);
        setImageSrc('/placeholder.svg');
      }
    };
    
    tryFindBetterImage();
  }, [url, thumbnail, imageError]);
  
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
            onError={() => {
              // If the selected image fails to load, use placeholder
              setImageError(true);
              setImageSrc('/placeholder.svg');
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
