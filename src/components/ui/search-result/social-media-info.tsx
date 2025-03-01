
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Video, Image, FileText, Globe, Search } from "lucide-react";

export interface SocialMediaInfo {
  Icon: React.ElementType;
  color: string;
  name: string;
}

export function getSocialMediaInfo(cleanSource: string, validType: string = 'website'): SocialMediaInfo {
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
        Icon: Video,
        color: 'text-black dark:text-white',
        name: 'TikTok',
      };
    } else if (validType === 'image') {
      return {
        Icon: Image,
        color: 'text-blue-600 dark:text-blue-400',
        name: cleanSource,
      };
    } else if (validType === 'social') {
      return {
        Icon: FileText,
        color: 'text-green-600 dark:text-green-400',
        name: cleanSource,
      };
    } else {
      return {
        Icon: Globe,
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
}
