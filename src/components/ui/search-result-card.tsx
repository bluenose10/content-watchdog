
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate, getMatchLevelColor } from "@/lib/utils";
import { ExternalLink, Search, FileSearch, Image, AlertTriangle } from "lucide-react";
import { Badge } from "./badge";
import { useEffect, useState } from "react";

interface SearchResultCardProps {
  result: {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    source: string;
    matchLevel: string;
    date: string;
  };
  isPremium?: boolean;
  isFreePreview?: boolean;
  onUpgrade?: () => void;
}

export function SearchResultCard({
  result,
  isPremium = false,
  isFreePreview = false,
  onUpgrade,
}: SearchResultCardProps) {
  const { title, url, thumbnail, source, matchLevel, date } = result;
  const [imageError, setImageError] = useState(false);
  
  // Clean up the title, url, and source if they contain Supabase URLs
  const cleanTitle = cleanSupabaseUrls(title, "title", source);
  const cleanUrl = cleanSupabaseUrls(url, "url", source);
  const cleanSource = cleanSupabaseUrls(source, "source");
  
  // Truncate long titles
  const truncatedTitle = cleanTitle.length > 60 ? cleanTitle.substring(0, 60) + '...' : cleanTitle;
  
  // Ensure matchLevel is a valid string before using it
  const safeMatchLevel = matchLevel || 'Medium';
  const matchColor = getMatchColorStyles(safeMatchLevel);
  
  // Safely format the date or provide a fallback
  const formattedDate = (() => {
    try {
      return date ? formatDate(date) : 'Recently';
    } catch (error) {
      return 'Recently';
    }
  })();
  
  // Get icon and styling based on match level
  const getIconParams = () => {
    switch(safeMatchLevel) {
      case 'High':
        return { 
          Icon: AlertTriangle, 
          bgColor: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900', 
          iconColor: 'text-red-500 dark:text-red-400',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'Medium':
        return { 
          Icon: FileSearch, 
          bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900', 
          iconColor: 'text-amber-500 dark:text-amber-400',
          borderColor: 'border-amber-200 dark:border-amber-800'
        };
      default:
        return { 
          Icon: Search, 
          bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900', 
          iconColor: 'text-blue-500 dark:text-blue-400',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
    }
  };
  
  // Get match level color styles
  function getMatchColorStyles(level: string) {
    switch(level) {
      case 'High':
        return {
          badge: 'bg-red-500 hover:bg-red-600 text-white',
          text: 'text-red-600 dark:text-red-400',
          border: 'border-red-200 dark:border-red-900',
          hover: 'hover:border-red-300 dark:hover:border-red-800',
          shadow: 'shadow-red-300/10'
        };
      case 'Medium':
        return {
          badge: 'bg-amber-500 hover:bg-amber-600 text-white',
          text: 'text-amber-600 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-900',
          hover: 'hover:border-amber-300 dark:hover:border-amber-800',
          shadow: 'shadow-amber-300/10'
        };
      default:
        return {
          badge: 'bg-blue-500 hover:bg-blue-600 text-white',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-900',
          hover: 'hover:border-blue-300 dark:hover:border-blue-800',
          shadow: 'shadow-blue-300/10'
        };
    }
  }
  
  const { Icon, bgColor, iconColor, borderColor } = getIconParams();

  // Function to clean Supabase URLs
  function cleanSupabaseUrls(str: string, type: "title" | "url" | "source", sourceDomain?: string): string {
    if (!str) return str;
    
    // If the string contains a Supabase URL
    if (str.includes('phkdkwusblkngypuwgao.supabase.co')) {
      // For source domains, just return a cleaner version
      if (type === "source") {
        if (str === 'phkdkwusblkngypuwgao.supabase.co') {
          return 'Social Media';
        }
        return str.replace(/^https?:\/\//, '').split('.')[0]; // Return just the domain name
      }
      
      // Handle titles and URLs based on the source domain
      if (sourceDomain === 'linkedin.com' || str.includes('linkedin.com')) {
        return type === "title" 
          ? 'Professional Profile on LinkedIn'
          : 'https://linkedin.com/in/profile';
      } else if (sourceDomain === 'facebook.com' || str.includes('facebook.com')) {
        return type === "title"
          ? 'Profile on Facebook'
          : 'https://facebook.com/profile';
      } else if (sourceDomain === 'instagram.com' || str.includes('instagram.com')) {
        return type === "title"
          ? 'Post on Instagram'
          : 'https://instagram.com/post';
      } else if (sourceDomain === 'twitter.com' || str.includes('twitter.com')) {
        return type === "title"
          ? 'Tweet on Twitter/X'
          : 'https://twitter.com/status';
      } else if (sourceDomain === 'youtube.com' || str.includes('youtube.com')) {
        return type === "title"
          ? 'Video on YouTube'
          : 'https://youtube.com/watch';
      } else if (sourceDomain === 'tiktok.com' || str.includes('tiktok.com')) {
        return type === "title"
          ? 'Video on TikTok'
          : 'https://tiktok.com/@user/video';
      }
      
      // If it's a storage URL or unrecognized URL with Supabase in it
      if (str.startsWith('https://phkdkwusblkngypuwgao.supabase.co/storage/')) {
        return type === "title" ? 'Content Match Found' : '#';
      }
    }
    
    return str;
  }

  // Check if thumbnail is a valid URL and not a Supabase URL
  const isValidThumbnail = () => {
    if (!thumbnail || imageError) return false;
    
    // Check if the thumbnail is from Supabase
    if (thumbnail.includes('phkdkwusblkngypuwgao.supabase.co')) {
      return false;
    }
    
    // Check if the thumbnail is actually the full image URL or a data URL
    // These are signs the API couldn't find a proper thumbnail
    if (thumbnail === url || thumbnail.includes('data:image')) {
      return false;
    }
    
    try {
      new URL(thumbnail);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Get a fallback image based on safeMatchLevel
  const getFallbackImage = () => {
    // Use consistent placeholder images based on match level
    switch(safeMatchLevel) {
      case 'High':
        return 'https://picsum.photos/seed/high/300/200';
      case 'Medium':
        return 'https://picsum.photos/seed/medium/300/200';
      default:
        return 'https://picsum.photos/seed/low/300/200';
    }
  };

  // Get actual URL to use for "Visit Site" button
  const getVisitUrl = (): string => {
    // Don't try to visit obviously invalid URLs
    if (cleanUrl === '#' || cleanUrl.includes('Content Match Found')) {
      return '#';
    }
    
    // Make sure URL is proper format
    try {
      new URL(cleanUrl);
      return cleanUrl;
    } catch (e) {
      // If it's not a valid URL, try to make it valid
      if (cleanUrl.includes('.com') || cleanUrl.includes('.org') || cleanUrl.includes('.net')) {
        return cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
      }
      return '#';
    }
  };
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${matchColor.border} ${matchColor.hover} ${matchColor.shadow} backdrop-blur-sm bg-white/80 dark:bg-gray-900/80`}>
      <div className="relative">
        <div 
          className={`overflow-hidden flex items-center justify-center ${bgColor}`}
          style={{ height: "200px" }}
        >
          {isValidThumbnail() ? (
            <img 
              src={thumbnail} 
              alt={cleanTitle}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="relative p-6 flex flex-col items-center justify-center text-center">
              <div className={`bg-white/80 dark:bg-gray-800/80 p-5 rounded-full border ${borderColor}`}>
                <Icon size={42} className={iconColor} strokeWidth={1.5} />
              </div>
              <div className="mt-4 text-sm font-medium bg-white/80 dark:bg-gray-800/80 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                <span className={matchColor.text}>Content Match Found</span>
              </div>
            </div>
          )}
        </div>
        <Badge 
          className={`absolute right-2 top-2 ${matchColor.badge}`}
        >
          {safeMatchLevel} Match
        </Badge>
        {isFreePreview && (
          <Badge 
            className="absolute left-2 top-2 bg-blue-500 text-white dark:bg-blue-600"
          >
            Free Preview
          </Badge>
        )}
        {!isPremium && !isFreePreview && (
          <Badge 
            className="absolute left-2 top-2 bg-purple-500 text-white dark:bg-purple-600 cursor-pointer hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
            onClick={onUpgrade}
          >
            Upgrade to View
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50">
        <h3 className="text-lg font-semibold" title={cleanTitle}>{truncatedTitle}</h3>
        <p className="text-sm text-muted-foreground">
          Found on <span className="font-medium">{cleanSource}</span> • {formattedDate}
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        {isPremium || isFreePreview ? (
          <p className="text-sm truncate text-gray-600 dark:text-gray-300" title={cleanUrl}>{cleanUrl}</p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-purple-600 dark:text-purple-400">Full details available with premium plan</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50">
        {isPremium || isFreePreview ? (
          <Button 
            asChild 
            variant="outline" 
            size="sm" 
            className={`w-full border ${matchColor.border} ${matchColor.hover} transition-all duration-300 group`}
          >
            <a href={getVisitUrl()} target="_blank" rel="noopener noreferrer">
              <ExternalLink className={`h-4 w-4 mr-2 ${matchColor.text} group-hover:rotate-12 transition-transform duration-300`} />
              Visit Site
            </a>
          </Button>
        ) : (
          <Button 
            onClick={onUpgrade} 
            variant="outline" 
            size="sm" 
            className="w-full border border-purple-200 hover:border-purple-300 dark:border-purple-800 dark:hover:border-purple-700 transition-all duration-300 group"
          >
            <span className="text-purple-600 dark:text-purple-400 flex items-center">
              <span className="mr-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Upgrade</span> to View
            </span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
