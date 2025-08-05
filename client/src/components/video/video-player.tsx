import { VideoWithCreator } from "@shared/schema";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  video: VideoWithCreator;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
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
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden" data-testid="video-player">
        {video.embedUrl ? (
          <iframe
            src={video.embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          />
        ) : video.videoUrl ? (
          <video 
            controls 
            className="w-full h-full"
            poster={video.thumbnail}
            src={video.videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Video not available</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Video Info */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {video.title}
        </h1>
        
        {/* Video Stats Only */}
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
          <span>{formatViewCount(video.viewCount)}</span>
          <span>•</span>
          <span>{formatTimeAgo(video.publishedAt!)}</span>
        </div>
        

        {/* Tags */}
        {Array.isArray(video.tags) && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {video.tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
