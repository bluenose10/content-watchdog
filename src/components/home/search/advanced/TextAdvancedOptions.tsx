
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Lock } from "lucide-react";
import { PremiumFeatureCard } from "../premium/PremiumFeatureCard";
import { AccessLevel } from "@/hooks/useProtectedRoute";

interface TextAdvancedOptionsProps {
  isPremium: boolean;
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
}

export function TextAdvancedOptions({
  isPremium,
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
  setSortBy
}: TextAdvancedOptionsProps) {
  const [siteInput, setSiteInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");

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

  return (
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
        <PremiumFeatureCard />
      )}
    </div>
  );
}
