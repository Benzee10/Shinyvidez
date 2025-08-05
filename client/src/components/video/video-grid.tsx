import { VideoWithCreator } from "@shared/schema";
import { VideoCard } from "./video-card";

interface VideoGridProps {
  videos: VideoWithCreator[];
  className?: string;
}

export function VideoGrid({ videos, className = "" }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12" data-testid="empty-video-grid">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No videos found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div 
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      data-testid="video-grid"
    >
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
