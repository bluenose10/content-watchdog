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
  
  const cleanTitle = cleanSupabaseUrls(title, "title", source);
  const cleanUrl = cleanSupabaseUrls(url, "url", source);
  const cleanSource = cleanSupabaseUrls(source, "source");
  
  const truncatedTitle = cleanTitle.length > 60 ? cleanTitle.substring(0, 60) + '...' : cleanTitle;
  
  const safeMatchLevel = matchLevel || 'Medium';
  const matchColor = getMatchColorStyles(safeMatchLevel);
  
  const formattedDate = (() => {
    try {
      return date ? formatDate(date) : 'Recently';
    } catch (error) {
      return 'Recently';
    }
  })();
  
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
  
  const getSocialMediaInfo = () => {
    const platform = cleanSource.toLowerCase();
    
    if (platform.includes('facebook')) {
      return {
        Icon: Facebook,
        color: 'text-blue-600',
        bgColor: 'bg-white',
        name: 'Facebook',
        iconUrl: '/lovable-uploads/d78c1f85-fa38-4209-bef7-ac0f1eebb85f.png',
        backgroundImage: '/lovable-uploads/921d062a-aa31-4af6-b436-33f404ae7fc9.png'
      };
    } else if (platform.includes('twitter') || platform.includes('x.com')) {
      return {
        Icon: Twitter,
        color: 'text-sky-500',
        bgColor: 'bg-white',
        name: 'Twitter/X',
        iconUrl: '/lovable-uploads/8c8c70f8-5aba-4fb4-8261-cc6c9c7a4ded.png',
        backgroundImage: '/lovable-uploads/921d062a-aa31-4af6-b436-33f404ae7fc9.png'
      };
    } else if (platform.includes('instagram')) {
      return {
        Icon: Instagram,
        color: 'text-pink-600',
        bgColor: 'bg-white',
        name: 'Instagram',
        iconUrl: '/lovable-uploads/554d6a51-776f-4eb2-90bb-728cb6d94365.png',
        backgroundImage: '/lovable-uploads/921d062a-aa31-4af6-b436-33f404ae7fc9.png'
      };
    } else if (platform.includes('linkedin')) {
      return {
        Icon: Linkedin,
        color: 'text-blue-700',
        bgColor: 'bg-white',
        name: 'LinkedIn',
        iconUrl: '/lovable-uploads/71eeb517-4964-4090-994c-5bad460e3be4.png',
        backgroundImage: '/lovable-uploads/921d062a-aa31-4af6-b436-33f404ae7fc9.png'
      };
    } else if (platform.includes('youtube')) {
      return {
        Icon: Youtube,
        color: 'text-red-600',
        bgColor: 'bg-white',
        name: 'YouTube',
        iconUrl: '/lovable-uploads/74f208e0-bb64-408c-826a-b51bba43af07.png',
        backgroundImage: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
      };
    } else if (platform.includes('tiktok')) {
      return {
        Icon: Search,
        color: 'text-black dark:text-white',
        bgColor: 'bg-white',
        name: 'TikTok',
        iconUrl: null,
        backgroundImage: '/lovable-uploads/921d062a-aa31-4af6-b436-33f404ae7fc9.png'
      };
    } else {
      return {
        Icon: Search,
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-white',
        name: cleanSource,
        iconUrl: null,
        backgroundImage: null
      };
    }
  };
  
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

  function cleanSupabaseUrls(str: string, type: "title" | "url" | "source", sourceDomain?: string): string {
    if (!str) return str;
    
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
    
    return str;
  }

  const isValidThumbnail = () => {
    if (!thumbnail || imageError) return false;
    
    if (thumbnail.includes('phkdkwusblkngypuwgao.supabase.co')) {
      return false;
    }
    
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

  const getVisitUrl = (): string => {
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
  };
  
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${matchColor.border} ${matchColor.hover} ${matchColor.shadow} backdrop-blur-sm bg-white/80 dark:bg-gray-900/80`}>
      <div className="relative">
        <div 
          className="overflow-hidden flex items-center justify-center bg-white"
          style={{ height: "200px" }}
        >
          {isValidThumbnail() ? (
            <img 
              src={thumbnail} 
              alt={cleanTitle}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : socialMedia.backgroundImage ? (
            <div className="relative w-full h-full">
              <img 
                src={socialMedia.backgroundImage} 
                alt={`${socialMedia.name} content`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white rounded-full p-2 shadow-md">
                {socialMedia.iconUrl ? (
                  <img 
                    src={socialMedia.iconUrl} 
                    alt={`${socialMedia.name} logo`}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <socialMedia.Icon size={24} className={socialMedia.color} />
                )}
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-white">
              {socialMedia.iconUrl ? (
                <img 
                  src={socialMedia.iconUrl} 
                  alt={`${socialMedia.name} logo`}
                  className="max-w-[80%] max-h-[80%] object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <socialMedia.Icon size={80} className={socialMedia.color} />
                  <p className="mt-2 text-lg font-semibold">{socialMedia.name}</p>
                </div>
              )}
              
              <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white p-2 text-center">
                Content found on {socialMedia.name}
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
