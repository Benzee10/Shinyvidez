// Note: In a real implementation, you would install and use Fuse.js
// For now, we'll implement a simple search function

export interface SearchableVideo {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  creator: {
    displayName: string;
    username: string;
  };
}

export function searchVideos(videos: SearchableVideo[], query: string): SearchableVideo[] {
  if (!query.trim()) return videos;
  
  const lowerQuery = query.toLowerCase();
  
  return videos.filter(video => {
    // Search in title
    if (video.title.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in description
    if (video.description?.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in tags
    if (video.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
    
    // Search in creator name
    if (video.creator.displayName.toLowerCase().includes(lowerQuery)) return true;
    if (video.creator.username.toLowerCase().includes(lowerQuery)) return true;
    
    return false;
  });
}

export function fuzzySearch(videos: SearchableVideo[], query: string): SearchableVideo[] {
  // Simple fuzzy search implementation
  // In production, use Fuse.js for better fuzzy search
  return searchVideos(videos, query);
}
