import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { VideoWithCreator } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { VideoPlayer } from "@/components/video/video-player";
import { AdSlot } from "@/components/ads/ad-slot";
import { VideoCard } from "@/components/video/video-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function VideoPage() {
  const [, params] = useRoute("/video/:id");
  const [searchQuery, setSearchQuery] = useState("");
  const videoId = params?.id;

  const { data: video, isLoading: videoLoading, error } = useQuery<VideoWithCreator>({
    queryKey: ["/api/videos", videoId],
    enabled: !!videoId,
  });

  const { data: relatedVideos = [] } = useQuery<VideoWithCreator[]>({
    queryKey: ["/api/videos", videoId, "related"],
    enabled: !!videoId,
  });

  if (videoLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header onSearch={setSearchQuery} />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="aspect-video bg-gray-700 rounded-xl mb-6"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header onSearch={setSearchQuery} />
        <div className="p-6">
          <div className="max-w-6xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-white mb-4">Video Not Found</h1>
            <p className="text-gray-400 mb-6">
              The video you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-300">
      <Header onSearch={setSearchQuery} />
      
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2"
                data-testid="back-button"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Videos</span>
              </Button>
            </Link>
          </div>

          {/* Video Player Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video Player */}
            <div className="lg:col-span-2">
              <VideoPlayer video={video} />

              {/* Top Ad Slot */}
              <AdSlot position="top" className="mt-6" />

              {/* Mid Ad Slot */}
              <AdSlot position="middle" className="mt-6" />
            </div>
            
            {/* Sidebar with Related Videos */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Related Videos</h3>
                
                {relatedVideos.length > 0 ? (
                  <div className="space-y-4">
                    {relatedVideos.map((relatedVideo) => (
                      <Link key={relatedVideo.id} href={`/video/${relatedVideo.id}`}>
                        <div 
                          className="flex space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                          data-testid={`related-video-${relatedVideo.id}`}
                        >
                          <div className="relative flex-shrink-0">
                            <img 
                              src={relatedVideo.thumbnail} 
                              alt={relatedVideo.title}
                              className="w-24 h-16 rounded-lg object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                              {relatedVideo.duration}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                              {relatedVideo.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {relatedVideo.creator.displayName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {(relatedVideo.viewCount || 0).toLocaleString()} views
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No related videos found</p>
                )}

                {/* Bottom Ad Slot */}
                <AdSlot position="bottom" className="mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
