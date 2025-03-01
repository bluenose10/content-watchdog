
import { Card, PriorityCard, HighlightCard, ImageCard, SocialCard } from "@/components/ui/card";
import { SearchResultContent } from "./content";
import { SearchResultCardProps } from "./types";
import { getVisitUrl } from "./utils";

export function SearchResultCard({
  result,
  isPremium = false,
  isFreePreview = false,
  onUpgrade,
}: SearchResultCardProps) {
  const validType = result.type || "website";
  const safeMatchLevel = result.matchLevel || 'Medium';
  
  // Choose the right card component based on type and match level
  const CardComponent = (() => {
    if (validType === 'image') return ImageCard;
    if (validType === 'social') return SocialCard;
    if (safeMatchLevel === 'High') return PriorityCard;
    if (safeMatchLevel === 'Medium') return HighlightCard;
    return Card;
  })();

  const viewDetails = () => {
    if (isPremium || isFreePreview) {
      const cleanUrl = result.url ? result.url : "#";
      const visitUrl = getVisitUrl(cleanUrl);
      if (visitUrl !== '#') {
        window.open(visitUrl, '_blank', 'noopener,noreferrer');
      } else {
        console.log("No valid URL to visit");
      }
    } else if (onUpgrade) {
      onUpgrade();
    }
  };

  try {
    return (
      <CardComponent 
        className={`overflow-hidden transition-all duration-300 hover:shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 cursor-pointer`}
        onClick={viewDetails}
      >
        <SearchResultContent 
          result={result}
          isPremium={isPremium}
          isFreePreview={isFreePreview}
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
