
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Search, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchQuery } from "@/lib/db-types";

interface RecentSearchesProps {
  searchQueries: SearchQuery[];
}

export function RecentSearches({ searchQueries }: RecentSearchesProps) {
  return (
    <Card className="glass-card md:col-span-2 transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle>Recent Searches</CardTitle>
        <CardDescription>
          Your most recent content searches and results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {searchQueries.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              You haven't performed any searches yet. Start by searching for your content.
            </p>
          ) : (
            searchQueries.slice(0, 3).map((search) => (
              <div key={search.id} className="flex items-start gap-4">
                <div className="rounded-full bg-secondary p-2">
                  {search.query_type === 'image' ? (
                    <Upload className="h-4 w-4" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {search.query_type === 'image' 
                      ? 'Image Search' 
                      : search.query_type === 'hashtag'
                        ? `Hashtag Search: #${search.query_text}`
                        : `Username Search: @${search.query_text}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {search.created_at ? formatDate(search.created_at) : 'Recent'}
                  </p>
                </div>
                <div className="ml-auto">
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/results?id=${search.id}`}>View Results</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link to="/history">
              View All Searches
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
