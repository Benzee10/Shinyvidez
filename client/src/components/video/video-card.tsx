import { Link } from "wouter";
import { Play } from "lucide-react";
import { VideoWithCreator } from "@shared/schema";
import { useState } from "react";

interface VideoCardProps {
  video: VideoWithCreator;
  className?: string;
}

export function VideoCard({ video, className = "" }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatViewCount = (count: number | null) => {
    const viewCount = count || 0;
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M views`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K views`;
    }
    return `${viewCount} views`;
  };

  const formatTimeAgo = (date: Date | string | null) => {
    if (!date) return "Unknown";
    const publishDate = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(publishDate.getTime())) return "Unknown";
    
    const now = new Date();
    const diffInMs = now.getTime() - publishDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <div 
      className={`video-card group cursor-pointer animate-fade-in ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`video-card-${video.id}`}
    >
      <Link href={`/video/${video.id}`}>
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          {/* Video Thumbnail/Preview */}
          <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="video-thumbnail w-full h-full object-cover transition-transform duration-300"
            />
            
            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 text-gray-900 ml-0.5 fill-current" />
              </div>
            </div>
          </div>
          
          {/* Video Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2">
              {video.title}
            </h3>
            
            {/* Creator Info */}
            <div className="flex items-center space-x-2 mb-2">
              <img 
                src={video.creator.avatar || "/placeholder-avatar.jpg"} 
                alt={video.creator.displayName}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {video.creator.displayName}
              </span>
              {video.creator.verified === 1 && (
                <span className="text-blue-500 text-xs">✓</span>
              )}
            </div>
            
            {/* Video Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{formatViewCount(video.viewCount)}</span>
              <span>{formatTimeAgo(video.publishedAt!)}</span>
            </div>
            
            {/* Tags */}
            {Array.isArray(video.tags) && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {video.tags.slice(0, 2).map((tag) => (
                  <span 
                    key={tag}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
