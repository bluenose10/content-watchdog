
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Image, Info } from "lucide-react";

interface ResultsHeaderProps {
  query: string;
  searchDate: string;
  totalResults: number;
}

export function ResultsHeader({ query, searchDate, totalResults }: ResultsHeaderProps) {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground text-lg">
          Results for {query ? <span className="font-medium">{query}</span> : <span>Unknown search</span>}
        </p>
      </div>

      <Card className="mb-8 mt-6">
        <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>Searched on {searchDate}</span>
          </div>
          <div className="flex items-center">
            <Image className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>Content search</span>
          </div>
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>Found {totalResults.toLocaleString()} matches</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
