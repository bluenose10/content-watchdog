
import { Card, HighlightCard, PriorityCard, ImageCard, SocialCard } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CardContent } from "./search-result/card-content";
import { getSocialMediaInfo } from "./search-result/social-media-info";
import { cleanSupabaseUrls, getMatchColorStyles, getVisitUrl } from "@/lib/card-utils";

interface SearchResultCardProps {
  result: {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    source: string;
    matchLevel: string;
    date: string;
    type?: string;
    snippet?: string;
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
  const { title, url, thumbnail, source, matchLevel, date, type = "website", snippet } = result;
  const navigate = useNavigate();
  
  // Ensure we have valid input data
  const validTitle = title || "Untitled Content";
  const validUrl = url || "#";
  const validSource = source || "Unknown Source";
  const validType = type || "website";
  
  const cleanTitle = cleanSupabaseUrls(validTitle, "title", validSource);
  const cleanUrl = cleanSupabaseUrls(validUrl, "url", validSource);
  const cleanSource = cleanSupabaseUrls(validSource, "source");
  
  const safeMatchLevel = matchLevel || 'Medium';
  const matchColor = getMatchColorStyles(safeMatchLevel);
  
  const socialMedia = getSocialMediaInfo(cleanSource, validType);
  
  const viewDetails = () => {
    if (isPremium || isFreePreview) {
      const visitUrl = getVisitUrl(cleanUrl);
      if (visitUrl !== '#') {
        // Fixed: Use window.open to properly navigate to external URLs
        window.open(visitUrl, '_blank', 'noopener,noreferrer');
      } else {
        // If we don't have a valid URL, just show a toast or similar notification
        console.log("No valid URL to visit");
      }
    } else if (onUpgrade) {
      onUpgrade();
    }
  };

  // Choose the right card component based on type and match level
  const CardComponent = (() => {
    if (validType === 'image') return ImageCard;
    if (validType === 'social') return SocialCard;
    if (safeMatchLevel === 'High') return PriorityCard;
    if (safeMatchLevel === 'Medium') return HighlightCard;
    return Card;
  })();

  try {
    return (
      <CardComponent 
        className={`overflow-hidden transition-all duration-300 hover:shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 cursor-pointer`}
        onClick={viewDetails}
      >
        <CardContent 
          cleanTitle={cleanTitle}
          cleanSource={cleanSource}
          cleanUrl={cleanUrl}
          date={date}
          matchColor={matchColor}
          safeMatchLevel={safeMatchLevel}
          snippet={snippet}
          isPremium={isPremium}
          isFreePreview={isFreePreview}
          socialMedia={socialMedia}
        />
      </CardComponent>
    );
  } catch (error) {
    console.error("Fatal rendering error in SearchResultCard:", error);
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-red-200 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        <div className="p-4">
          <h3 className="text-lg font-semibold">Content Preview</h3>
          <p className="text-sm text-muted-foreground">
            There was an error displaying this content.
          </p>
        </div>
      </Card>
    );
  }
}
