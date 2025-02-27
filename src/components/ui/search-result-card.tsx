
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate, getMatchLevelColor } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Badge } from "./badge";

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
  onUpgrade?: () => void;
}

export function SearchResultCard({
  result,
  isPremium = false,
  onUpgrade,
}: SearchResultCardProps) {
  const { title, url, thumbnail, source, matchLevel, date } = result;
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative">
        <div className="overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="h-40 w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <Badge 
          className={`absolute right-2 top-2 ${getMatchLevelColor(matchLevel)} text-white`}
        >
          {matchLevel} Match
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Found on {source} • {formatDate(date)}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        {isPremium ? (
          <p className="text-sm truncate">{url}</p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm">Full details available with premium plan</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isPremium ? (
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
