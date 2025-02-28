
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NameSearch } from "./NameSearch";
import { HashtagSearch } from "./HashtagSearch";
import { ImageSearch } from "./ImageSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Sliders, Info, Filter, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TextSearchParams, ImageSearchParams } from "@/lib/db-types";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";

interface SearchTabsProps {
  onNameSearch: (query: string, params?: TextSearchParams) => Promise<void>;
  onHashtagSearch: (query: string, params?: TextSearchParams) => Promise<void>;
  onImageSearch: (file: File, params?: ImageSearchParams) => Promise<void>;
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
  const { user } = useAuth();
  const { accessLevel } = useProtectedRoute(false);
  const isPremium = accessLevel === AccessLevel.PREMIUM;
  
  // Text search advanced parameters
  const [exactMatch, setExactMatch] = useState(false);
  const [dateRestrict, setDateRestrict] = useState("any");
  const [contentFilter, setContentFilter] = useState("medium");
  const [searchType, setSearchType] = useState("web");
  const [sitesToInclude, setSitesToInclude] = useState<string[]>([]);
  const [sitesToExclude, setSitesToExclude] = useState<string[]>([]);
  const [siteInput, setSiteInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("us");
  const [fileType, setFileType] = useState("any");
  const [rights, setRights] = useState("any");
  const [sortBy, setSortBy] = useState("relevance");
  
  // Image search advanced parameters
  const [similarityThreshold, setSimilarityThreshold] = useState([0.6]);
  const [searchMode, setSearchMode] = useState("relaxed");
  const [includeSimilarColors, setIncludeSimilarColors] = useState(true);
  const [includePartialMatches, setIncludePartialMatches] = useState(true);
  const [minSize, setMinSize] = useState("medium");
  const [imageType, setImageType] = useState("any");
  const [imageColorType, setImageColorType] = useState("any");
  const [dominantColor, setDominantColor] = useState("any");
  
  const handleNameSearch = async (query: string) => {
    const params: TextSearchParams | undefined = showAdvanced ? {
      exactMatch,
      dateRestrict: dateRestrict === "any" ? undefined : dateRestrict,
      contentFilter,
      searchType,
      siteFilter: sitesToInclude.length ? sitesToInclude : undefined,
      excludeSites: sitesToExclude.length ? sitesToExclude : undefined,
      language: language || undefined,
      country: country || undefined,
      fileType: fileType !== "any" ? fileType : undefined,
      rights: rights !== "any" ? rights : undefined,
      sortBy: sortBy || undefined
    } : undefined;
    
    await onNameSearch(query, params);
  };
  
  const handleHashtagSearch = async (query: string) => {
    const params: TextSearchParams | undefined = showAdvanced ? {
      exactMatch,
      dateRestrict: dateRestrict === "any" ? undefined : dateRestrict,
      contentFilter,
      searchType,
      siteFilter: sitesToInclude.length ? sitesToInclude : undefined,
      excludeSites: sitesToExclude.length ? sitesToExclude : undefined,
      language: language || undefined,
      country: country || undefined,
      fileType: fileType !== "any" ? fileType : undefined,
      rights: rights !== "any" ? rights : undefined,
      sortBy: sortBy || undefined
    } : undefined;
    
    await onHashtagSearch(query, params);
  };
  
  const handleImageSearch = async (file: File) => {
    const params: ImageSearchParams | undefined = showAdvanced ? {
      similarityThreshold: similarityThreshold[0],
      searchMode,
      includeSimilarColors,
      includePartialMatches,
      minSize,
      imageType: imageType !== "any" ? imageType : undefined,
      imageColorType: imageColorType !== "any" ? imageColorType : undefined,
      dominantColor: dominantColor !== "any" ? dominantColor : undefined
    } : undefined;
    
    await onImageSearch(file, params);
  };
  
  const addSiteToInclude = () => {
    if (siteInput && !sitesToInclude.includes(siteInput)) {
      setSitesToInclude([...sitesToInclude, siteInput]);
      setSiteInput("");
    }
  };
  
  const removeSiteToInclude = (site: string) => {
    setSitesToInclude(sitesToInclude.filter(s => s !== site));
  };
  
  const addSiteToExclude = () => {
    if (excludeInput && !sitesToExclude.includes(excludeInput)) {
      setSitesToExclude([...sitesToExclude, excludeInput]);
      setExcludeInput("");
    }
  };
  
  const removeSiteToExclude = (site: string) => {
    setSitesToExclude(sitesToExclude.filter(s => s !== site));
  };

  const renderPremiumFeatureCard = () => (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/60 dark:to-indigo-950/60 p-5 rounded-lg border border-purple-200 dark:border-purple-800 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
          <Lock className="h-5 w-5 text-purple-700 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-400 mb-1">Premium Feature</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Advanced filters and search customization are available exclusively for premium users.
          </p>
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="text-xs border-purple-300 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            >
              <Link to="/#pricing">
                Upgrade to Premium
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  
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
            <CardTitle className="text-sm font-medium flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Search Options
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2 text-sm">
            {activeTab !== "image" ? (
              <div className="space-y-6">
                {/* Basic Options Section - Available to all users */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm border-b pb-1">Basic Options</h3>
                  
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
                </div>
                
                {/* Site Filters Section - Limited version for free users */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm border-b pb-1">Site Filters</h3>
                  
                  {isPremium ? (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="siteInclude" className="text-sm">Only include these sites</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="siteInclude" 
                            value={siteInput} 
                            onChange={(e) => setSiteInput(e.target.value)}
                            placeholder="e.g., instagram.com"
                            className="h-8 text-xs"
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={addSiteToInclude}
                            disabled={!siteInput}
                          >
                            Add
                          </Button>
                        </div>
                        {sitesToInclude.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sitesToInclude.map(site => (
                              <Badge 
                                key={site} 
                                variant="secondary"
                                className="px-2 py-1 text-xs"
                              >
                                {site}
                                <button 
                                  className="ml-1 text-xs" 
                                  onClick={() => removeSiteToInclude(site)}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="siteExclude" className="text-sm">Exclude these sites</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="siteExclude" 
                            value={excludeInput} 
                            onChange={(e) => setExcludeInput(e.target.value)}
                            placeholder="e.g., pinterest.com"
                            className="h-8 text-xs"
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={addSiteToExclude}
                            disabled={!excludeInput}
                          >
                            Add
                          </Button>
                        </div>
                        {sitesToExclude.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sitesToExclude.map(site => (
                              <Badge 
                                key={site} 
                                variant="secondary"
                                className="px-2 py-1 text-xs"
                              >
                                {site}
                                <button 
                                  className="ml-1 text-xs" 
                                  onClick={() => removeSiteToExclude(site)}
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      <p>Basic site filtering options are available to all users.</p>
                      <p className="mt-1 flex items-center text-purple-600 dark:text-purple-400">
                        <Lock className="w-3 h-3 mr-1" />
                        Advanced site filtering available with premium.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* More Filters Section - Premium only */}
                {isPremium ? (
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm border-b pb-1">Premium Filters</h3>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="language" className="text-sm">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language" className="h-8 text-xs">
                          <SelectValue placeholder="English" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="it">Italian</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="ko">Korean</SelectItem>
                          <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
                          <SelectItem value="ru">Russian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="country" className="text-sm">Country</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger id="country" className="h-8 text-xs">
                          <SelectValue placeholder="United States" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="br">Brazil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="fileType" className="text-sm">File Type</Label>
                      <Select value={fileType} onValueChange={setFileType}>
                        <SelectTrigger id="fileType" className="h-8 text-xs">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="doc">DOC</SelectItem>
                          <SelectItem value="ppt">PPT</SelectItem>
                          <SelectItem value="xls">XLS</SelectItem>
                          <SelectItem value="txt">TXT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="rights" className="text-sm">Usage Rights</Label>
                      <Select value={rights} onValueChange={setRights}>
                        <SelectTrigger id="rights" className="h-8 text-xs">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="cc_publicdomain">Public Domain</SelectItem>
                          <SelectItem value="cc_attribute">Free to use with attribution</SelectItem>
                          <SelectItem value="cc_sharealike">Free to use with attribution and sharing</SelectItem>
                          <SelectItem value="cc_noncommercial">Free to use for non-commercial purposes</SelectItem>
                          <SelectItem value="cc_nonderived">Free to use but not modify</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="sortBy" className="text-sm">Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger id="sortBy" className="h-8 text-xs">
                          <SelectValue placeholder="Relevance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="date">Date (newest first)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  renderPremiumFeatureCard()
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Basic Image Filters Section - Available to all users */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm border-b pb-1">Basic Image Filters</h3>
                  
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
                </div>
                
                {/* Advanced Image Filters Section - Premium only */}
                {isPremium ? (
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm border-b pb-1">Premium Image Filters</h3>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeSimilarColors" 
                        checked={includeSimilarColors} 
                        onCheckedChange={(checked) => setIncludeSimilarColors(checked === true)}
                      />
                      <Label htmlFor="includeSimilarColors" className="text-sm">Include similar colors</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includePartialMatches" 
                        checked={includePartialMatches} 
                        onCheckedChange={(checked) => setIncludePartialMatches(checked === true)}
                      />
                      <Label htmlFor="includePartialMatches" className="text-sm">Include partial matches</Label>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="minSize" className="text-sm">Minimum size</Label>
                      <Select value={minSize} onValueChange={setMinSize}>
                        <SelectTrigger id="minSize" className="h-8 text-xs">
                          <SelectValue placeholder="Medium" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="xlarge">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="imageType" className="text-sm">Image type</Label>
                      <Select value={imageType} onValueChange={setImageType}>
                        <SelectTrigger id="imageType" className="h-8 text-xs">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="face">Face</SelectItem>
                          <SelectItem value="photo">Photo</SelectItem>
                          <SelectItem value="clipart">Clipart</SelectItem>
                          <SelectItem value="lineart">Line art</SelectItem>
                          <SelectItem value="animated">Animated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="imageColorType" className="text-sm">Color type</Label>
                      <Select value={imageColorType} onValueChange={setImageColorType}>
                        <SelectTrigger id="imageColorType" className="h-8 text-xs">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="color">Color</SelectItem>
                          <SelectItem value="gray">Grayscale</SelectItem>
                          <SelectItem value="mono">Black & White</SelectItem>
                          <SelectItem value="trans">Transparent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="dominantColor" className="text-sm">Dominant color</Label>
                      <Select value={dominantColor} onValueChange={setDominantColor}>
                        <SelectTrigger id="dominantColor" className="h-8 text-xs">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                          <SelectItem value="yellow">Yellow</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="teal">Teal</SelectItem>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="pink">Pink</SelectItem>
                          <SelectItem value="white">White</SelectItem>
                          <SelectItem value="gray">Gray</SelectItem>
                          <SelectItem value="black">Black</SelectItem>
                          <SelectItem value="brown">Brown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  renderPremiumFeatureCard()
                )}
                
                {isPremium && (
                  <div className="flex items-start gap-2 p-2 mt-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded text-xs">
                    <Info className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-amber-800 dark:text-amber-300">
                      Advanced image search options allow you to fine-tune your results for more precise matches.
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <TabsContent value="name">
        <NameSearch onSearch={handleNameSearch} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="hashtag">
        <HashtagSearch onSearch={handleHashtagSearch} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="image">
        <ImageSearch onSearch={handleImageSearch} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
}
