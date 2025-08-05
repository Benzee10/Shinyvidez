import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Creator, VideoWithCreator } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { VideoGrid } from "@/components/video/video-grid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function CreatorPage() {
  const [, params] = useRoute("/creator/:username");
  const [searchQuery, setSearchQuery] = useState("");
  const username = params?.username;

  const { data: creator, isLoading: creatorLoading, error } = useQuery<Creator>({
    queryKey: ["/api/creators/username", username],
    enabled: !!username,
  });

  const { data: creatorVideos = [], isLoading: videosLoading } = useQuery<VideoWithCreator[]>({
    queryKey: ["/api/videos"],
    queryFn: async () => {
      if (!creator?.id) return [];
      const response = await fetch(`/api/videos?creator=${creator.id}`);
      if (!response.ok) throw new Error('Failed to fetch creator videos');
      return response.json();
    },
    enabled: !!creator?.id,
  });

  const formatSubscriberCount = (count: number | null) => {
    const subCount = count || 0;
    if (subCount >= 1000000) {
      return `${(subCount / 1000000).toFixed(1)}M subscribers`;
    } else if (subCount >= 1000) {
      return `${(subCount / 1000).toFixed(1)}K subscribers`;
    }
    return `${subCount} subscribers`;
  };

  const formatJoinDate = (date: Date) => {
    const now = new Date();
    const joinDate = new Date(date);
    const diffInYears = now.getFullYear() - joinDate.getFullYear();
    
    if (diffInYears === 0) return "Joined this year";
    if (diffInYears === 1) return "Joined 1 year ago";
    return `Joined ${diffInYears} years ago`;
  };

  if (creatorLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header onSearch={setSearchQuery} />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header onSearch={setSearchQuery} />
        <div className="p-6">
          <div className="max-w-6xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Creator Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The creator you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button className="flex items-center space-x-2">
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
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
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>

          {/* Creator Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8">
            <div className="flex items-center space-x-6">
              <img 
                src={creator.avatar || "/placeholder-avatar.jpg"} 
                alt={creator.displayName}
                className="w-24 h-24 rounded-full"
                data-testid="creator-avatar"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {creator.displayName}
                  {creator.verified === 1 && (
                    <span className="text-blue-500 ml-2">✓</span>
                  )}
                </h1>
                {creator.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                    {creator.bio}
                  </p>
                )}
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <span data-testid="subscriber-count">
                    {formatSubscriberCount(creator.subscriberCount)}
                  </span>
                  <span>•</span>
                  <span data-testid="video-count">
                    {creatorVideos.length} videos
                  </span>
                  <span>•</span>
                  <span data-testid="join-date">
                    {formatJoinDate(creator.createdAt!)}
                  </span>
                </div>
              </div>
              <Button 
                className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                data-testid="subscribe-button"
              >
                Subscribe
              </Button>
            </div>
          </div>

          {/* Creator's Videos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Latest Videos ({creatorVideos.length})
            </h2>
            
            {videosLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-pulse">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <VideoGrid videos={creatorVideos} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
