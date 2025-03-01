
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NameSearch } from "./NameSearch";
import { HashtagSearch } from "./HashtagSearch";
import { ImageSearch } from "./ImageSearch";
import { useAuth } from "@/context/AuthContext";
import { AccessLevel, useProtectedRoute } from "@/hooks/useProtectedRoute";
import { TextSearchParams, ImageSearchParams } from "@/lib/db-types";
import { SignUpPrompt } from "./auth/SignUpPrompt";
import { AdvancedSearchButton } from "./advanced/AdvancedSearchButton";
import { AdvancedOptions } from "./advanced/AdvancedOptions";

interface SearchTabsProps {
  onNameSearch: (query: string, params?: TextSearchParams) => Promise<void>;
  onHashtagSearch: (query: string, params?: TextSearchParams) => Promise<void>;
  onImageSearch: (file: File, params?: ImageSearchParams) => Promise<void>;
  isLoading: boolean;
  isAuthenticated?: boolean;
}

export function SearchTabs({
  onNameSearch,
  onHashtagSearch,
  onImageSearch,
  isLoading,
  isAuthenticated = false,
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
  
  // Update the Advanced Search toggling to be disabled for non-authenticated users
  const advancedSearchButtonDisabled = !isAuthenticated;
  
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
      
      {/* Show sign up message for non-authenticated users */}
      {!isAuthenticated && <SignUpPrompt />}

      {/* Simply show sign up button for all tabs if not authenticated */}
      {!isAuthenticated ? null : (
        <>
          {/* Advanced Search Toggle - only for authenticated users */}
          <AdvancedSearchButton 
            showAdvanced={showAdvanced} 
            setShowAdvanced={setShowAdvanced} 
            disabled={advancedSearchButtonDisabled} 
          />
          
          {showAdvanced && (
            <AdvancedOptions
              activeTab={activeTab}
              isPremium={isPremium}
              // Text search params
              exactMatch={exactMatch}
              setExactMatch={setExactMatch}
              dateRestrict={dateRestrict}
              setDateRestrict={setDateRestrict}
              contentFilter={contentFilter}
              setContentFilter={setContentFilter}
              searchType={searchType}
              setSearchType={setSearchType}
              sitesToInclude={sitesToInclude}
              setSitesToInclude={setSitesToInclude}
              sitesToExclude={sitesToExclude}
              setSitesToExclude={setSitesToExclude}
              language={language}
              setLanguage={setLanguage}
              country={country}
              setCountry={setCountry}
              fileType={fileType}
              setFileType={setFileType}
              rights={rights}
              setRights={setRights}
              sortBy={sortBy}
              setSortBy={setSortBy}
              // Image search params
              similarityThreshold={similarityThreshold}
              setSimilarityThreshold={setSimilarityThreshold}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              includeSimilarColors={includeSimilarColors}
              setIncludeSimilarColors={setIncludeSimilarColors}
              includePartialMatches={includePartialMatches}
              setIncludePartialMatches={setIncludePartialMatches}
              minSize={minSize}
              setMinSize={setMinSize}
              imageType={imageType}
              setImageType={setImageType}
              imageColorType={imageColorType}
              setImageColorType={setImageColorType}
              dominantColor={dominantColor}
              setDominantColor={setDominantColor}
            />
          )}
          
          <TabsContent value="name">
            <NameSearch onSearch={handleNameSearch} isLoading={isLoading} isAuthenticated={isAuthenticated} />
          </TabsContent>
          
          <TabsContent value="hashtag">
            <HashtagSearch onSearch={handleHashtagSearch} isLoading={isLoading} isAuthenticated={isAuthenticated} />
          </TabsContent>
          
          <TabsContent value="image">
            <ImageSearch onSearch={handleImageSearch} isLoading={isLoading} isAuthenticated={isAuthenticated} />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}
