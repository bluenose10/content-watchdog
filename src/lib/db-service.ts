
import { supabase } from './supabase';
import { SearchQuery, SearchResult, UserSubscription } from './db-types';

// Search queries functions
export const createSearchQuery = async (searchQuery: SearchQuery) => {
  const { data, error } = await supabase
    .from('search_queries')
    .insert(searchQuery)
    .select();
  
  if (error) throw error;
  return data?.[0];
};

export const getUserSearchQueries = async (userId: string) => {
  const { data, error } = await supabase
    .from('search_queries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getSearchQueryById = async (searchId: string) => {
  const { data, error } = await supabase
    .from('search_queries')
    .select('*')
    .eq('id', searchId)
    .single();
  
  if (error) throw error;
  return data;
};

// Delete search query and its results
export const deleteSearchQuery = async (searchId: string) => {
  // First get the search query to check if there's an image to delete
  const { data: searchQuery, error: fetchError } = await supabase
    .from('search_queries')
    .select('*')
    .eq('id', searchId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // If there's an image URL, delete it from storage
  if (searchQuery.image_url && searchQuery.query_type === 'image') {
    try {
      // Extract the file path from the URL
      const storageUrl = new URL(searchQuery.image_url);
      const pathParts = storageUrl.pathname.split('/');
      const storagePath = pathParts.slice(pathParts.indexOf('storage') + 2).join('/');
      
      if (storagePath) {
        console.log('Deleting file from storage:', storagePath);
        const { error: storageError } = await supabase.storage
          .from('uploads')
          .remove([storagePath]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue with deleting the record even if file delete fails
        }
      }
    } catch (e) {
      console.error('Error processing image URL for deletion:', e);
      // Continue with deletion even if URL parsing fails
    }
  }
  
  // Now delete the search query (cascading delete will remove results too)
  const { error } = await supabase
    .from('search_queries')
    .delete()
    .eq('id', searchId);
  
  if (error) throw error;
  
  return { success: true };
};

// Search results functions
export const createSearchResults = async (results: SearchResult[]) => {
  if (!results || results.length === 0) {
    console.error('No results provided to createSearchResults');
    return [];
  }
  
  console.log('Creating search results:', results);
  
  try {
    const { data, error } = await supabase
      .from('search_results')
      .insert(results)
      .select();
    
    if (error) {
      console.error('Error creating search results:', error);
      throw error;
    }
    
    console.log('Created search results:', data?.length);
    return data;
  } catch (error) {
    console.error('Exception creating search results:', error);
    throw error;
  }
};

export const getSearchResults = async (searchId: string) => {
  const { data, error } = await supabase
    .from('search_results')
    .select('*')
    .eq('search_id', searchId)
    .order('match_level', { ascending: false });
  
  if (error) throw error;
  return data;
};

// User subscription functions
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*, plans(*)')
    .eq('user_id', userId)
    .maybeSingle();
  
  // If no subscription found, it's not an error - user is on free plan
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createUserSubscription = async (subscription: UserSubscription) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .upsert(subscription)
    .select();
  
  if (error) throw error;
  return data?.[0];
};

// Google Custom Search API function
export const performGoogleSearch = async (query: string, userId: string) => {
  try {
    console.log('Performing Google search for query:', query, 'by user:', userId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock search results based on query
    const mockResults = {
      items: [
        {
          title: `${query} Profile on LinkedIn`,
          link: 'https://linkedin.com/in/profile',
          displayLink: 'linkedin.com',
          snippet: `Professional profile page for ${query} with recent activity.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=1' }]
          }
        },
        {
          title: `${query} on Twitter`,
          link: 'https://twitter.com/profile',
          displayLink: 'twitter.com',
          snippet: `Latest tweets and posts from ${query}.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=2' }]
          }
        },
        {
          title: `${query} on Instagram`,
          link: 'https://instagram.com/profile',
          displayLink: 'instagram.com',
          snippet: `Photos and videos shared by ${query} on Instagram.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=3' }]
          }
        },
        {
          title: `${query}'s YouTube Channel`,
          link: 'https://youtube.com/channel',
          displayLink: 'youtube.com',
          snippet: `Watch videos uploaded by ${query} on YouTube.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=4' }]
          }
        },
        {
          title: `${query} on Facebook`,
          link: 'https://facebook.com/profile',
          displayLink: 'facebook.com',
          snippet: `Public profile and posts from ${query} on Facebook.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=5' }]
          }
        },
        {
          title: `${query} on Pinterest`,
          link: 'https://pinterest.com/profile',
          displayLink: 'pinterest.com',
          snippet: `${query}'s Pinterest boards and pins.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=6' }]
          }
        },
        {
          title: `${query} on TikTok`,
          link: 'https://tiktok.com/@profile',
          displayLink: 'tiktok.com',
          snippet: `${query}'s TikTok videos and profile information.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=7' }]
          }
        },
        {
          title: `${query} on Reddit`,
          link: 'https://reddit.com/user/profile',
          displayLink: 'reddit.com',
          snippet: `${query}'s Reddit posts and comments.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=8' }]
          }
        },
        {
          title: `${query} on Medium`,
          link: 'https://medium.com/@profile',
          displayLink: 'medium.com',
          snippet: `Articles written by ${query} on Medium.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=9' }]
          }
        },
        {
          title: `${query} on Etsy`,
          link: 'https://etsy.com/shop/profile',
          displayLink: 'etsy.com',
          snippet: `${query}'s products and shop on Etsy.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=10' }]
          }
        },
        {
          title: `${query} on Snapchat`,
          link: 'https://snapchat.com/add/profile',
          displayLink: 'snapchat.com',
          snippet: `${query}'s Snapchat profile and stories.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=11' }]
          }
        },
        {
          title: `${query} on Twitch`,
          link: 'https://twitch.tv/profile',
          displayLink: 'twitch.tv',
          snippet: `${query}'s live streams and channel on Twitch.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=12' }]
          }
        },
        {
          title: `${query} on DeviantArt`,
          link: 'https://deviantart.com/profile',
          displayLink: 'deviantart.com',
          snippet: `${query}'s artwork and portfolio on DeviantArt.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=13' }]
          }
        },
        {
          title: `${query} on Behance`,
          link: 'https://behance.net/profile',
          displayLink: 'behance.net',
          snippet: `${query}'s design portfolio on Behance.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=14' }]
          }
        },
        {
          title: `${query} on Dribbble`,
          link: 'https://dribbble.com/profile',
          displayLink: 'dribbble.com',
          snippet: `${query}'s design work on Dribbble.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=15' }]
          }
        },
        {
          title: `${query} on Vimeo`,
          link: 'https://vimeo.com/profile',
          displayLink: 'vimeo.com',
          snippet: `${query}'s videos on Vimeo.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=16' }]
          }
        },
        {
          title: `${query} on Spotify`,
          link: 'https://open.spotify.com/artist/profile',
          displayLink: 'open.spotify.com',
          snippet: `${query}'s music on Spotify.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=17' }]
          }
        },
        {
          title: `${query} on SoundCloud`,
          link: 'https://soundcloud.com/profile',
          displayLink: 'soundcloud.com',
          snippet: `${query}'s tracks on SoundCloud.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=18' }]
          }
        },
        {
          title: `${query} on Flickr`,
          link: 'https://flickr.com/photos/profile',
          displayLink: 'flickr.com',
          snippet: `${query}'s photography on Flickr.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=19' }]
          }
        },
        {
          title: `${query} on GitHub`,
          link: 'https://github.com/profile',
          displayLink: 'github.com',
          snippet: `${query}'s code repositories and contributions on GitHub.`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=20' }]
          }
        }
      ]
    };
    
    console.log('Generated mock results:', mockResults.items.length);
    return mockResults;
  } catch (error) {
    console.error('Google Search API error:', error);
    
    // Return fallback results in case of error
    return {
      items: [
        {
          title: `${query} Profile`,
          link: 'https://linkedin.com/in/profile',
          displayLink: 'linkedin.com',
          snippet: `Profile information for ${query}`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=1' }]
          }
        },
        {
          title: `${query} Social Media`,
          link: 'https://twitter.com/profile',
          displayLink: 'twitter.com',
          snippet: `Social media activity for ${query}`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=2' }]
          }
        },
        {
          title: `${query} Online Presence`,
          link: 'https://instagram.com/profile',
          displayLink: 'instagram.com',
          snippet: `Online presence related to ${query}`,
          pagemap: {
            cse_image: [{ src: 'https://picsum.photos/200/300?random=3' }]
          }
        }
      ]
    };
  }
};

// Image Search function - separate from text search
export const performImageSearch = async (imageUrl: string, userId: string) => {
  try {
    console.log('Performing image search with URL:', imageUrl);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock image search results
    const mockResults = {
      items: [
        {
          title: 'LinkedIn Profile Match',
          link: 'https://linkedin.com/in/profile-match',
          displayLink: 'linkedin.com',
          snippet: 'Professional profile page with potential image match.',
          image: {
            contextLink: 'https://linkedin.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=1',
          }
        },
        {
          title: 'Facebook Profile Match',
          link: 'https://facebook.com/profile-match',
          displayLink: 'facebook.com',
          snippet: 'Social media profile with potential image match.',
          image: {
            contextLink: 'https://facebook.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=2',
          }
        },
        {
          title: 'Instagram Post',
          link: 'https://instagram.com/p/abcdef123456',
          displayLink: 'instagram.com',
          snippet: 'Image post with similar visual elements.',
          image: {
            contextLink: 'https://instagram.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=3',
          }
        },
        {
          title: 'Twitter Image Post',
          link: 'https://twitter.com/user/status/123456789',
          displayLink: 'twitter.com',
          snippet: 'Tweet containing a similar image.',
          image: {
            contextLink: 'https://twitter.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=4',
          }
        },
        {
          title: 'YouTube Thumbnail Match',
          link: 'https://youtube.com/watch?v=abc123def456',
          displayLink: 'youtube.com',
          snippet: 'Video with similar thumbnail image.',
          image: {
            contextLink: 'https://youtube.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=5',
          }
        },
        {
          title: 'TikTok Video Preview',
          link: 'https://tiktok.com/@user/video/123456789',
          displayLink: 'tiktok.com',
          snippet: 'Short video with similar visual content.',
          image: {
            contextLink: 'https://tiktok.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=6',
          }
        },
        {
          title: 'Pinterest Pin',
          link: 'https://pinterest.com/pin/123456789',
          displayLink: 'pinterest.com',
          snippet: 'Pinned image with similar content.',
          image: {
            contextLink: 'https://pinterest.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=7',
          }
        },
        {
          title: 'Medium Article Image',
          link: 'https://medium.com/article-with-image',
          displayLink: 'medium.com',
          snippet: 'Article featuring a similar image.',
          image: {
            contextLink: 'https://medium.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=8',
          }
        },
        {
          title: 'Reddit Post',
          link: 'https://reddit.com/r/subreddit/comments/123456',
          displayLink: 'reddit.com',
          snippet: 'Reddit post containing a similar image.',
          image: {
            contextLink: 'https://reddit.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=9',
          }
        },
        {
          title: 'Tumblr Blog Post',
          link: 'https://tumblr.com/post/123456789',
          displayLink: 'tumblr.com',
          snippet: 'Blog post with a matching image.',
          image: {
            contextLink: 'https://tumblr.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=10',
          }
        },
        {
          title: 'Flickr Photo',
          link: 'https://flickr.com/photos/user/123456789',
          displayLink: 'flickr.com',
          snippet: 'Photo with similar composition and elements.',
          image: {
            contextLink: 'https://flickr.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=11',
          }
        },
        {
          title: 'DeviantArt Artwork',
          link: 'https://deviantart.com/user/art/123456789',
          displayLink: 'deviantart.com',
          snippet: 'Artwork with similar style and elements.',
          image: {
            contextLink: 'https://deviantart.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=12',
          }
        },
        {
          title: 'Behance Project',
          link: 'https://behance.net/gallery/123456789/project-title',
          displayLink: 'behance.net',
          snippet: 'Design project featuring similar visuals.',
          image: {
            contextLink: 'https://behance.net',
            thumbnailLink: 'https://picsum.photos/200/300?random=13',
          }
        },
        {
          title: 'Dribbble Shot',
          link: 'https://dribbble.com/shots/123456789',
          displayLink: 'dribbble.com',
          snippet: 'Design shot with matching elements.',
          image: {
            contextLink: 'https://dribbble.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=14',
          }
        },
        {
          title: 'Unsplash Photo',
          link: 'https://unsplash.com/photos/abcdef123456',
          displayLink: 'unsplash.com',
          snippet: 'Stock photo with similar composition.',
          image: {
            contextLink: 'https://unsplash.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=15',
          }
        },
        {
          title: 'Pexels Photo',
          link: 'https://pexels.com/photos/123456789',
          displayLink: 'pexels.com',
          snippet: 'Free stock photo with similar content.',
          image: {
            contextLink: 'https://pexels.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=16',
          }
        },
        {
          title: 'Shutterstock Image',
          link: 'https://shutterstock.com/image-photo/123456789',
          displayLink: 'shutterstock.com',
          snippet: 'Stock image with similar subject matter.',
          image: {
            contextLink: 'https://shutterstock.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=17',
          }
        },
        {
          title: 'Getty Images Photo',
          link: 'https://gettyimages.com/detail/123456789',
          displayLink: 'gettyimages.com',
          snippet: 'Professional photo with matching elements.',
          image: {
            contextLink: 'https://gettyimages.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=18',
          }
        },
        {
          title: 'Adobe Stock Photo',
          link: 'https://stock.adobe.com/123456789',
          displayLink: 'stock.adobe.com',
          snippet: 'Stock photo with similar composition and subject.',
          image: {
            contextLink: 'https://stock.adobe.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=19',
          }
        },
        {
          title: 'iStock Photo',
          link: 'https://istockphoto.com/photo/123456789',
          displayLink: 'istockphoto.com',
          snippet: 'Stock image with similar visual elements.',
          image: {
            contextLink: 'https://istockphoto.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=20',
          }
        }
      ]
    };
    
    console.log('Generated mock image results:', mockResults.items.length);
    return mockResults;
  } catch (error) {
    console.error('Image Search API error:', error);
    
    // Return fallback results if the API call fails
    const fallbackResults = {
      items: [
        {
          title: 'LinkedIn Profile Match',
          link: 'https://linkedin.com/in/profile-match',
          displayLink: 'linkedin.com',
          snippet: 'Professional profile page with potential image match.',
          image: {
            contextLink: 'https://linkedin.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=1',
          }
        },
        {
          title: 'Facebook Profile Match',
          link: 'https://facebook.com/profile-match',
          displayLink: 'facebook.com',
          snippet: 'Social media profile with potential image match.',
          image: {
            contextLink: 'https://facebook.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=2',
          }
        },
        {
          title: 'Instagram Post',
          link: 'https://instagram.com/p/abcdef123456',
          displayLink: 'instagram.com',
          snippet: 'Image post with similar visual elements.',
          image: {
            contextLink: 'https://instagram.com',
            thumbnailLink: 'https://picsum.photos/200/300?random=3',
          }
        }
      ]
    };
    
    return fallbackResults;
  }
};

// File upload functions
export const uploadSearchImage = async (file: File, userId: string) => {
  // Create a clean filename with user ID and timestamp to avoid collisions
  const fileExt = file.name.split('.').pop();
  const sanitizedFileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `search-images/${sanitizedFileName}`;

  console.log(`Uploading file ${file.name} to ${filePath}`);

  // Upload the file to the storage bucket
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from('uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type
    });
  
  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error(`Error uploading file: ${uploadError.message}`);
  }
  
  console.log('File uploaded successfully:', uploadData);
  
  // Get the public URL of the uploaded file
  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);
  
  if (!data.publicUrl) {
    throw new Error('Failed to get public URL for uploaded file');
  }
  
  console.log('Public URL:', data.publicUrl);
  return data.publicUrl;
};

// Get free plan details
export const getFreePlan = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('id', 'free')
    .single();
  
  if (error) throw error;
  return data;
};

// Get all available plans
export const getPlans = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('price', { ascending: true });
  
  if (error) throw error;
  return data;
};
