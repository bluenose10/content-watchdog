
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate, getMatchLevelColor } from "@/lib/utils";
import { ExternalLink, Search, FileSearch, Image } from "lucide-react";
import { Badge } from "./badge";
import { useEffect, useState } from "react";

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
  
  // Get icon size and color based on match level
  const getIconParams = () => {
    switch(safeMatchLevel) {
      case 'High':
        return { size: 80, color: '#10b981', Icon: FileSearch };
      case 'Medium':
        return { size: 70, color: '#3b82f6', Icon: Search };
      default:
        return { size: 60, color: '#6b7280', Icon: Image };
    }
  };
  
  const { size, color, Icon } = getIconParams();
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border border-green-300 bg-green-50/30">
      <div className="relative">
        <div 
          className="overflow-hidden flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200" 
          style={{ height: "225px" }}
        >
          <div className="relative p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-white/70 p-6 rounded-full" style={{ color: color }}>
              <Icon size={size} strokeWidth={1.5} />
            </div>
            <div className="mt-4 text-sm font-medium bg-white/90 px-4 py-1.5 rounded-full border border-green-300 shadow-sm">
              Content Match Found
            </div>
          </div>
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
      <CardHeader className="pb-2 bg-green-50/70">
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
      <CardFooter className="bg-green-50/70">
        {isPremium || isFreePreview ? (
          <Button asChild variant="outline" size="sm" className="w-full gap-1 border-green-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300">
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
            className="w-full border-green-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300"
          >
            Upgrade to View
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
