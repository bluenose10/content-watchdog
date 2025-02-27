
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NameSearch } from "./NameSearch";
import { HashtagSearch } from "./HashtagSearch";
import { ImageSearch } from "./ImageSearch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sliders, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchTabsProps {
  onNameSearch: (query: string, params?: any) => Promise<void>;
  onHashtagSearch: (query: string, params?: any) => Promise<void>;
  onImageSearch: (file: File, params?: any) => Promise<void>;
  isLoading: boolean;
}

export function SearchTabs({
  onNameSearch,
  onHashtagSearch,
  onImageSearch,
  isLoading,
}: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState("name");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Text search advanced parameters
  const [exactMatch, setExactMatch] = useState(false);
  const [dateRestrict, setDateRestrict] = useState("any");
  const [contentFilter, setContentFilter] = useState("medium");
  const [searchType, setSearchType] = useState("web");
  
  // Image search advanced parameters
  const [similarityThreshold, setSimilarityThreshold] = useState([0.6]);
  const [searchMode, setSearchMode] = useState("relaxed");
  
  const handleNameSearch = async (query: string) => {
    const params = showAdvanced ? {
      exactMatch,
      dateRestrict: dateRestrict === "any" ? undefined : dateRestrict,
      contentFilter,
      searchType
    } : undefined;
    
    await onNameSearch(query, params);
  };
  
  const handleHashtagSearch = async (query: string) => {
    const params = showAdvanced ? {
      exactMatch,
      dateRestrict: dateRestrict === "any" ? undefined : dateRestrict,
      contentFilter,
      searchType
    } : undefined;
    
    await onHashtagSearch(query, params);
  };
  
  const handleImageSearch = async (file: File) => {
    const params = showAdvanced ? {
      similarityThreshold: similarityThreshold[0],
      searchMode
    } : undefined;
    
    await onImageSearch(file, params);
  };
  
  return (
    <Tabs 
      defaultValue="name" 
      className="w-full" 
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="name">Name</TabsTrigger>
        <TabsTrigger value="hashtag">Hashtag</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
      </TabsList>
      
      {/* Advanced Search Toggle */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 text-xs"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Sliders className="w-3.5 h-3.5" />
          {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
        </Button>
      </div>
      
      {showAdvanced && (
        <Card className="mb-4 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Advanced Search Options</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2 text-sm">
            {activeTab !== "image" ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="exactMatch" 
                    checked={exactMatch} 
                    onCheckedChange={(checked) => setExactMatch(checked === true)}
                  />
                  <Label htmlFor="exactMatch" className="text-sm">Exact match only</Label>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="dateRestrict" className="text-sm">Time frame</Label>
                  <Select value={dateRestrict} onValueChange={setDateRestrict}>
                    <SelectTrigger id="dateRestrict" className="h-8 text-xs">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="last24h">Past 24 hours</SelectItem>
                      <SelectItem value="lastWeek">Past week</SelectItem>
                      <SelectItem value="lastMonth">Past month</SelectItem>
                      <SelectItem value="lastYear">Past year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="contentFilter" className="text-sm">Content filter</Label>
                  <Select value={contentFilter} onValueChange={setContentFilter}>
                    <SelectTrigger id="contentFilter" className="h-8 text-xs">
                      <SelectValue placeholder="Medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="searchType" className="text-sm">Search type</Label>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger id="searchType" className="h-8 text-xs">
                      <SelectValue placeholder="Web" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="social">Social media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label htmlFor="similarityThreshold" className="text-sm">
                      Similarity threshold
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(similarityThreshold[0] * 100)}%
                    </span>
                  </div>
                  <Slider
                    id="similarityThreshold" 
                    defaultValue={[0.6]} 
                    max={1} 
                    step={0.05} 
                    value={similarityThreshold} 
                    onValueChange={setSimilarityThreshold}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Less strict</span>
                    <span>More strict</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="searchMode" className="text-sm">Search mode</Label>
                  <Select value={searchMode} onValueChange={setSearchMode}>
                    <SelectTrigger id="searchMode" className="h-8 text-xs">
                      <SelectValue placeholder="Relaxed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relaxed">Relaxed (more results)</SelectItem>
                      <SelectItem value="strict">Strict (higher quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded text-xs">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-amber-800 dark:text-amber-300">
                    Higher similarity thresholds and strict mode will return fewer but more accurate results.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <TabsContent value="name">
        <NameSearch onSearch={handleNameSearch} isSearching={isLoading} />
      </TabsContent>
      
      <TabsContent value="hashtag">
        <HashtagSearch onSearch={handleHashtagSearch} isSearching={isLoading} />
      </TabsContent>
      
      <TabsContent value="image">
        <ImageSearch onSearch={handleImageSearch} isUploading={isLoading} />
      </TabsContent>
    </Tabs>
  );
}
