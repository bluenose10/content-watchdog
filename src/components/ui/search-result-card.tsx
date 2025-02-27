
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate, getMatchLevelColor } from "@/lib/utils";
import { ExternalLink, Search, FileSearch, Image, AlertTriangle, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
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
  
  // Get social media platform info
  const getSocialMediaInfo = () => {
    const platform = cleanSource.toLowerCase();
    
    if (platform.includes('facebook')) {
      return {
        Icon: Facebook,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        name: 'Facebook',
        brandColor: 'from-blue-600 to-blue-800',
        logoUrl: 'public/lovable-uploads/f1cbed5d-2990-460f-8e09-7eaf6f2e5c0c.png'
      };
    } else if (platform.includes('twitter') || platform.includes('x.com')) {
      return {
        Icon: Twitter,
        color: 'text-sky-500',
        bgColor: 'bg-sky-50 dark:bg-sky-900/30',
        name: 'Twitter/X',
        brandColor: 'from-sky-400 to-sky-600',
        logoUrl: null // Using icon since Twitter/X logo not provided
      };
    } else if (platform.includes('instagram')) {
      return {
        Icon: Instagram,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50 dark:bg-pink-900/30',
        name: 'Instagram',
        brandColor: 'from-pink-500 via-purple-500 to-orange-500',
        logoUrl: 'public/lovable-uploads/6e36b8a0-a51b-48a4-a920-29680cd4bcae.png'
      };
    } else if (platform.includes('linkedin')) {
      return {
        Icon: Linkedin,
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        name: 'LinkedIn',
        brandColor: 'from-blue-700 to-blue-900',
        logoUrl: 'public/lovable-uploads/cdde8926-a941-4e4c-8b16-18a1360ee5be.png'
      };
    } else if (platform.includes('youtube')) {
      return {
        Icon: Youtube,
        color: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-900/30',
        name: 'YouTube',
        brandColor: 'from-red-600 to-red-800',
        logoUrl: 'public/lovable-uploads/3ee2383a-6a4c-4531-b338-ae13d53c6f6e.png'
      };
    } else if (platform.includes('tiktok')) {
      return {
        Icon: Search, // No specific TikTok icon in lucide-react
        color: 'text-black dark:text-white',
        bgColor: 'bg-pink-50 dark:bg-pink-900/30',
        name: 'TikTok',
        brandColor: 'from-black via-cyan-500 to-pink-500',
        logoUrl: null
      };
    } else {
      return {
        Icon: Search,
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-900/30',
        name: cleanSource,
        brandColor: 'from-gray-500 to-gray-700',
        logoUrl: null
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
  const socialMedia = getSocialMediaInfo();

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
            <div className="relative w-full h-full">
              {/* Platform Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${socialMedia.brandColor} flex items-center justify-center p-8`}>
                {socialMedia.logoUrl ? (
                  <img 
                    src={socialMedia.logoUrl} 
                    alt={socialMedia.name}
                    className="max-w-[80%] max-h-[80%] object-contain drop-shadow-lg"
                    onError={(e) => {
                      console.error("Error loading logo:", e);
                      // If logo fails to load, we'll still see the platform name below
                    }}
                  />
                ) : (
                  <socialMedia.Icon className="text-white/80" size={120} strokeWidth={1} />
                )}
              </div>
              
              {/* Platform Name */}
              <div className="absolute bottom-0 inset-x-0 bg-black/50 p-2 flex items-center justify-center">
                <div className="text-lg font-bold text-white">
                  Content found on {socialMedia.name}
                </div>
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
        <div className="absolute left-2 bottom-2 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 border border-gray-200 dark:border-gray-700">
          <socialMedia.Icon size={18} className={socialMedia.color} />
        </div>
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
