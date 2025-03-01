
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";
import { PremiumFeatureCard } from "../premium/PremiumFeatureCard";

interface ImageAdvancedOptionsProps {
  isPremium: boolean;
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

export function ImageAdvancedOptions({
  isPremium,
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
}: ImageAdvancedOptionsProps) {
  return (
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
        <PremiumFeatureCard />
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
  );
}
