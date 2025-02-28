
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDate, getMatchLevelColor } from "@/lib/utils";
import { ExternalLink, Search, FileSearch, Image, AlertTriangle, Facebook, Twitter, Linkedin, Instagram, Youtube, ArrowRight } from "lucide-react";
import { Badge } from "./badge";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  // Ensure we have valid input data
  const validTitle = title || "Untitled Content";
  const validUrl = url || "#";
  const validSource = source || "Unknown Source";
  
  const cleanTitle = cleanSupabaseUrls(validTitle, "title", validSource);
  const cleanUrl = cleanSupabaseUrls(validUrl, "url", validSource);
  const cleanSource = cleanSupabaseUrls(validSource, "source");
  
  const truncatedTitle = cleanTitle.length > 60 ? cleanTitle.substring(0, 60) + '...' : cleanTitle;
  
  const safeMatchLevel = matchLevel || 'Medium';
  const matchColor = getMatchColorStyles(safeMatchLevel);
  
  const formattedDate = (() => {
    try {
      return date ? formatDate(date) : 'Recently';
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'Recently';
    }
  })();
  
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
  
  const getSocialMediaInfo = () => {
    try {
      const platform = cleanSource.toLowerCase();
      
      if (platform.includes('facebook')) {
        return {
          Icon: Facebook,
          color: 'text-blue-600',
          name: 'Facebook',
        };
      } else if (platform.includes('instagram')) {
        return {
          Icon: Instagram,
          color: 'text-pink-600',
          name: 'Instagram',
        };
      } else if (platform.includes('linkedin')) {
        return {
          Icon: Linkedin,
          color: 'text-blue-700',
          name: 'LinkedIn',
        };
      } else if (platform.includes('twitter') || platform.includes('x.com')) {
        return {
          Icon: Twitter,
          color: 'text-sky-500',
          name: 'Twitter/X',
        };
      } else if (platform.includes('youtube')) {
        return {
          Icon: Youtube,
          color: 'text-red-600',
          name: 'YouTube',
        };
      } else if (platform.includes('tiktok')) {
        return {
          Icon: Search,
          color: 'text-black dark:text-white',
          name: 'TikTok',
        };
      } else {
        return {
          Icon: Search,
          color: 'text-gray-600 dark:text-gray-400',
          name: cleanSource,
        };
      }
    } catch (error) {
      console.error("Error in getSocialMediaInfo:", error);
      // Fallback to default
      return {
        Icon: Search,
        color: 'text-gray-600 dark:text-gray-400',
        name: 'Unknown',
      };
    }
  };
  
  function cleanSupabaseUrls(str: string, type: "title" | "url" | "source", sourceDomain?: string): string {
    if (!str) return type === "title" ? "Untitled Content" : type === "url" ? "#" : "Unknown Source";
    
    try {
      if (str.includes('phkdkwusblkngypuwgao.supabase.co')) {
        if (type === "source") {
          if (str === 'phkdkwusblkngypuwgao.supabase.co') {
            return 'Social Media';
          }
          return str.replace(/^https?:\/\//, '').split('.')[0];
        }
        
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
        
        if (str.startsWith('https://phkdkwusblkngypuwgao.supabase.co/storage/')) {
          return type === "title" ? 'Content Match Found' : '#';
        }
      }
    } catch (error) {
      console.error("Error in cleanSupabaseUrls:", error);
      return type === "title" ? "Untitled Content" : type === "url" ? "#" : "Unknown Source";
    }
    
    return str;
  }

  const getVisitUrl = (): string => {
    try {
      if (cleanUrl === '#' || cleanUrl.includes('Content Match Found')) {
        return '#';
      }
      
      try {
        new URL(cleanUrl);
        return cleanUrl;
      } catch (e) {
        if (cleanUrl.includes('.com') || cleanUrl.includes('.org') || cleanUrl.includes('.net')) {
          return cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
        }
        return '#';
      }
    } catch (error) {
      console.error("Error in getVisitUrl:", error);
      return '#';
    }
  };
  
  const socialMedia = getSocialMediaInfo();
  const viewDetails = () => {
    if (isPremium || isFreePreview) {
      // Here we would navigate to a detailed view if we had one
      window.open(getVisitUrl(), '_blank');
    } else if (onUpgrade) {
      onUpgrade();
    }
  };

  try {
    return (
      <Card 
        className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${matchColor.border} ${matchColor.hover} ${matchColor.shadow} backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 cursor-pointer`}
        onClick={viewDetails}
      >
        <div className="flex items-center p-4">
          <div className="mr-3">
            <div className={`rounded-full p-2 ${socialMedia.color} bg-gray-100 dark:bg-gray-800`}>
              <socialMedia.Icon size={20} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium truncate" title={cleanTitle}>
                {truncatedTitle}
              </h3>
              <Badge className={`ml-2 shrink-0 ${matchColor.badge}`}>
                {safeMatchLevel}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span className="font-medium truncate">{cleanSource}</span>
              <span className="mx-1">•</span>
              <span>{formattedDate}</span>
            </div>
            
            {isPremium || isFreePreview ? (
              <p className="text-xs truncate text-gray-600 dark:text-gray-300 mt-1" title={cleanUrl}>
                {cleanUrl}
              </p>
            ) : (
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Upgrade to view full details
              </p>
            )}
          </div>
          
          <div className="ml-2 shrink-0">
            <ArrowRight className={`h-5 w-5 ${matchColor.text}`} />
          </div>
        </div>
      </Card>
    );
  } catch (error) {
    console.error("Fatal rendering error in SearchResultCard:", error);
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-red-200 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        <div className="p-4">
          <h3 className="text-lg font-semibold">Content Preview</h3>
          <p className="text-sm text-muted-foreground">
            There was an error displaying this content.
          </p>
        </div>
      </Card>
    );
  }
}
