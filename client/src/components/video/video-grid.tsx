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
        <p className="text-gray-400 text-lg">No videos found</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div 
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 ${className}`}
      data-testid="video-grid"
    >
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
