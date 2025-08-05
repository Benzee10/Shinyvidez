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
        <div className="relative bg-gray-900 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
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
          
          {/* Video Info - Simplified */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <h3 className="font-medium text-white line-clamp-2 text-sm mb-1">
              {video.title}
            </h3>
            
            {/* Minimal Stats */}
            <div className="flex items-center justify-between text-xs text-white/80">
              <span>{formatViewCount(video.viewCount)}</span>
              <span>{formatTimeAgo(video.publishedAt!)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
