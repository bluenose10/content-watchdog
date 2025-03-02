
import { formatDate } from "@/lib/utils";

export function getMatchColorStyles(level: string) {
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

export function cleanSupabaseUrls(str: string, type: "title" | "url" | "source", sourceDomain?: string): string {
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

export function getVisitUrl(cleanUrl: string): string {
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
}

export function formatSafeDate(date: string | undefined): string {
  try {
    return date ? formatDate(date) : 'Recently';
  } catch (error) {
    console.error("Date formatting error:", error);
    return 'Recently';
  }
}
