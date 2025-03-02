
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { SearchResultCardProps } from "./types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SearchResultCard({
  result
}: SearchResultCardProps) {
  const [linkStatus, setLinkStatus] = useState<"unknown" | "valid" | "broken">("unknown");

  // Function to verify link status when hovering over the View button
  const checkLinkStatus = () => {
    if (linkStatus !== "unknown") return; // Only check once
    
    // Simple HEAD request to check if the URL is accessible
    fetch(result.url, { method: 'HEAD', mode: 'no-cors' })
      .then(() => setLinkStatus("valid"))
      .catch(() => setLinkStatus("broken"));
  };

  // Format the date for better readability
  const formattedDate = result.date ? new Date(result.date).toLocaleDateString() : "";

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${linkStatus === "broken" ? "border-amber-200 bg-amber-50/30" : ""}`}>
      <div className="p-4">
        <CardHeader className="p-0 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium line-clamp-2">
              {result.title}
            </CardTitle>
            
            <div className="flex flex-shrink-0 gap-2">
              {linkStatus === "broken" && (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertTriangle className="h-3 w-3 mr-1" /> May be unavailable
                </Badge>
              )}
              
              {result.matchLevel && (
                <Badge variant={
                  result.matchLevel.toLowerCase() === 'high' ? 'destructive' : 
                  result.matchLevel.toLowerCase() === 'medium' ? 'secondary' : 'outline'
                } className="ml-2">
                  {result.matchLevel} match
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <span className="font-medium">{result.source}</span> 
            {formattedDate && (
              <>
                <span className="text-muted-foreground">•</span> 
                <span>{formattedDate}</span>
              </>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0 py-2">
          {result.snippet && (
            <p className="text-sm text-muted-foreground line-clamp-3">{result.snippet}</p>
          )}
          {!result.snippet && (
            <p className="text-xs italic text-muted-foreground">No content preview available</p>
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
            variant={linkStatus === "broken" ? "outline" : "ghost"}
            className="text-xs" 
            asChild
            onMouseEnter={checkLinkStatus}
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
