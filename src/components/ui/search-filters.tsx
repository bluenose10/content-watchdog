
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type SortOption = "relevance" | "date-new" | "date-old";
export type MatchLevelFilter = "all" | "high" | "medium" | "low";
export type SourceFilter = string[];

interface SearchFiltersProps {
  onFilterChange: (filters: {
    sort: SortOption;
    matchLevel: MatchLevelFilter;
    sources: SourceFilter;
    keyword: string;
  }) => void;
  availableSources: string[];
  totalResults: number;
}

export function SearchFilters({ 
  onFilterChange, 
  availableSources,
  totalResults 
}: SearchFiltersProps) {
  const [sort, setSort] = useState<SortOption>("relevance");
  const [matchLevel, setMatchLevel] = useState<MatchLevelFilter>("all");
  const [selectedSources, setSelectedSources] = useState<SourceFilter>([]);
  const [keyword, setKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSortChange = (value: string) => {
    const newSort = value as SortOption;
    setSort(newSort);
    applyFilters(newSort, matchLevel, selectedSources, keyword);
  };
  
  const handleMatchLevelChange = (value: string) => {
    const newMatchLevel = value as MatchLevelFilter;
    setMatchLevel(newMatchLevel);
    applyFilters(sort, newMatchLevel, selectedSources, keyword);
  };
  
  const toggleSource = (source: string) => {
    let newSources: string[];
    
    if (selectedSources.includes(source)) {
      newSources = selectedSources.filter(s => s !== source);
    } else {
      newSources = [...selectedSources, source];
    }
    
    setSelectedSources(newSources);
    applyFilters(sort, matchLevel, newSources, keyword);
  };
  
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    applyFilters(sort, matchLevel, selectedSources, e.target.value);
  };
  
  const clearFilters = () => {
    setSort("relevance");
    setMatchLevel("all");
    setSelectedSources([]);
    setKeyword("");
    applyFilters("relevance", "all", [], "");
  };
  
  const applyFilters = (
    newSort: SortOption, 
    newMatchLevel: MatchLevelFilter, 
    newSources: SourceFilter,
    newKeyword: string
  ) => {
    onFilterChange({
      sort: newSort,
      matchLevel: newMatchLevel,
      sources: newSources,
      keyword: newKeyword
    });
  };
  
  const isFiltered = matchLevel !== "all" || selectedSources.length > 0 || keyword !== "";
  const uniqueSources = [...new Set(availableSources)].sort();
  
  return (
    <div className="w-full space-y-2">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search within results"
              className="pl-8"
              value={keyword}
              onChange={handleKeywordChange}
            />
            {keyword && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={() => {
                  setKeyword("");
                  applyFilters(sort, matchLevel, selectedSources, "");
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
          
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
            {isFiltered && (
              <Badge variant="secondary" className="ml-1 h-5 px-1">
                {selectedSources.length + (matchLevel !== "all" ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Sort: {sort === "relevance" ? "Relevance" : sort === "date-new" ? "Newest" : "Oldest"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sort} onValueChange={handleSortChange}>
              <DropdownMenuRadioItem value="relevance">Relevance</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="date-new">Newest first</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="date-old">Oldest first</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {showFilters && (
        <div className="bg-background border rounded-md p-4 mt-2 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Match Level</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={matchLevel === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleMatchLevelChange("all")}
              >
                All
              </Button>
              <Button
                variant={matchLevel === "high" ? "default" : "outline"}
                size="sm"
                className={matchLevel === "high" ? "bg-red-500 hover:bg-red-600" : "border-red-200 text-red-600 hover:text-red-700"}
                onClick={() => handleMatchLevelChange("high")}
              >
                High
              </Button>
              <Button
                variant={matchLevel === "medium" ? "default" : "outline"}
                size="sm"
                className={matchLevel === "medium" ? "bg-amber-500 hover:bg-amber-600" : "border-amber-200 text-amber-600 hover:text-amber-700"}
                onClick={() => handleMatchLevelChange("medium")}
              >
                Medium
              </Button>
              <Button
                variant={matchLevel === "low" ? "default" : "outline"}
                size="sm"
                className={matchLevel === "low" ? "bg-blue-500 hover:bg-blue-600" : "border-blue-200 text-blue-600 hover:text-blue-700"}
                onClick={() => handleMatchLevelChange("low")}
              >
                Low
              </Button>
            </div>
          </div>
          
          {uniqueSources.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Sources</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueSources.map((source) => (
                  <Button
                    key={source}
                    variant={selectedSources.includes(source) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSource(source)}
                  >
                    {source}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {isFiltered && (
            <div className="flex justify-between items-center pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Showing filtered results
              </p>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {totalResults} matches found
          {isFiltered && <span> (filtered)</span>}
        </p>
      </div>
    </div>
  );
}
