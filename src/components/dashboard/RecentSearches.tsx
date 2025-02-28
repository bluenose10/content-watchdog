
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Search, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchQuery } from "@/lib/db-types";

interface RecentSearchesProps {
  searchQueries: SearchQuery[];
  onSelectSearch?: (searchId: string) => void;
  selectedSearchId?: string | null;
}

export function RecentSearches({ searchQueries, onSelectSearch, selectedSearchId }: RecentSearchesProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-purple-100/50 dark:border-purple-800/30 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-950/40 md:col-span-2">
      <CardHeader className="border-b border-purple-100/30 dark:border-purple-900/30 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/30 dark:to-blue-900/30">
        <CardTitle className="text-xl font-semibold text-gradient">Recent Searches</CardTitle>
        <CardDescription>
          Your most recent content searches and results
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {searchQueries.length === 0 ? (
            <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg">
              <Search className="mx-auto h-10 w-10 text-muted-foreground opacity-20 mb-3" />
              <p className="text-center text-muted-foreground">
                You haven't performed any searches yet. Start by searching for your content.
              </p>
              <Button className="mt-4" asChild>
                <Link to="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Start Searching
                </Link>
              </Button>
            </div>
          ) : (
            searchQueries.slice(0, 3).map((search) => (
              <div 
                key={search.id} 
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedSearchId === search.id 
                    ? 'bg-primary/10 dark:bg-primary/20 border border-primary/20' 
                    : 'hover:bg-gray-100/70 dark:hover:bg-gray-800/70 border border-transparent'
                }`}
                onClick={() => onSelectSearch && search.id && onSelectSearch(search.id)}
              >
                <div className={`rounded-full p-2 ${
                  selectedSearchId === search.id
                    ? 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-800 dark:to-blue-800'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'
                }`}>
                  {search.query_type === 'image' ? (
                    <Upload className={`h-4 w-4 ${
                      selectedSearchId === search.id
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`} />
                  ) : (
                    <Search className={`h-4 w-4 ${
                      selectedSearchId === search.id
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {search.query_type === 'image' 
                      ? 'Image Search' 
                      : search.query_type === 'hashtag'
                        ? `Hashtag: #${search.query_text}`
                        : `Username: @${search.query_text}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {search.created_at ? formatDate(search.created_at) : 'Recent'}
                  </p>
                </div>
                <div className="ml-auto">
                  <Button size="sm" variant={selectedSearchId === search.id ? "default" : "outline"} className={
                    selectedSearchId === search.id 
                      ? "bg-primary hover:bg-primary/90"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }>
                    View
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        {searchQueries.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="py-2 px-4 bg-white dark:bg-gray-900 backdrop-blur-sm border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700" asChild>
              <Link to="/history">
                View All Searches
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
