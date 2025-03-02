
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { SearchResultCardProps } from "./types";
import { Button } from "@/components/ui/button";

export function SearchResultCard({
  result
}: SearchResultCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <CardHeader className="p-0 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium line-clamp-2">
              {result.title}
            </CardTitle>
            
            {result.matchLevel && (
              <Badge variant={
                result.matchLevel === 'high' ? 'destructive' : 
                result.matchLevel === 'medium' ? 'secondary' : 'outline'
              } className="ml-2">
                {result.matchLevel} match
              </Badge>
            )}
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            {result.source} • {result.date}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0 py-2">
          {result.snippet && (
            <p className="text-sm text-muted-foreground line-clamp-2">{result.snippet}</p>
          )}
        </CardContent>
        
        <CardFooter className="p-0 pt-2 flex justify-between items-center">
          <div className="flex space-x-2">
            {result.type && (
              <Badge variant="outline" className="text-xs">
                {result.type}
              </Badge>
            )}
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-xs" 
            asChild
          >
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              View <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
