
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { TextAdvancedOptions } from "./TextAdvancedOptions";
import { ImageAdvancedOptions } from "./ImageAdvancedOptions";
import { AccessLevel } from "@/hooks/useProtectedRoute";

interface AdvancedOptionsProps {
  activeTab: string;
  isPremium: boolean;
  // Text search params
  exactMatch: boolean;
  setExactMatch: (checked: boolean) => void;
  dateRestrict: string;
  setDateRestrict: (value: string) => void;
  contentFilter: string;
  setContentFilter: (value: string) => void;
  searchType: string;
  setSearchType: (value: string) => void;
  sitesToInclude: string[];
  setSitesToInclude: (sites: string[]) => void;
  sitesToExclude: string[];
  setSitesToExclude: (sites: string[]) => void;
  language: string;
  setLanguage: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  fileType: string;
  setFileType: (value: string) => void;
  rights: string;
  setRights: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  // Image search params
  similarityThreshold: number[];
  setSimilarityThreshold: (value: number[]) => void;
  searchMode: string;
  setSearchMode: (value: string) => void;
  includeSimilarColors: boolean;
  setIncludeSimilarColors: (checked: boolean) => void;
  includePartialMatches: boolean;
  setIncludePartialMatches: (checked: boolean) => void;
  minSize: string;
  setMinSize: (value: string) => void;
  imageType: string;
  setImageType: (value: string) => void;
  imageColorType: string;
  setImageColorType: (value: string) => void;
  dominantColor: string;
  setDominantColor: (value: string) => void;
}

export function AdvancedOptions({
  activeTab,
  isPremium,
  // Text search params
  exactMatch,
  setExactMatch,
  dateRestrict,
  setDateRestrict,
  contentFilter,
  setContentFilter,
  searchType,
  setSearchType,
  sitesToInclude,
  setSitesToInclude,
  sitesToExclude,
  setSitesToExclude,
  language,
  setLanguage,
  country,
  setCountry,
  fileType,
  setFileType,
  rights,
  setRights,
  sortBy,
  setSortBy,
  // Image search params
  similarityThreshold,
  setSimilarityThreshold,
  searchMode,
  setSearchMode,
  includeSimilarColors,
  setIncludeSimilarColors,
  includePartialMatches,
  setIncludePartialMatches,
  minSize,
  setMinSize,
  imageType,
  setImageType,
  imageColorType,
  setImageColorType,
  dominantColor,
  setDominantColor
}: AdvancedOptionsProps) {
  return (
    <Card className="mb-4 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Search Options
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2 text-sm">
        {activeTab !== "image" ? (
          <TextAdvancedOptions 
            isPremium={isPremium}
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
          />
        ) : (
          <ImageAdvancedOptions 
            isPremium={isPremium}
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
      </CardContent>
    </Card>
  );
}
