import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { VideoWithCreator, Category } from "@shared/schema";
import { Header } from "@/components/layout/header";

import { VideoGrid } from "@/components/video/video-grid";
import { AdSlot } from "@/components/ads/ad-slot";
import { BannerAd } from "@/components/ads/banner-ad";
import { HeaderAd } from "@/components/ads/header-ad";
import { ImageAd } from "@/components/ads/image-ad";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { searchVideos } from "@/lib/search";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredVideos, setFilteredVideos] = useState<VideoWithCreator[]>([]);

  const { data: videos = [], isLoading: videosLoading } = useQuery<VideoWithCreator[]>({
    queryKey: ["/api/videos"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    let result = [...videos];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(video.tags) && video.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        video.creator.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(video => video.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
        break;
      case "popular":
        result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case "liked":
        result.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
    }

    setFilteredVideos(result);
  }, [videos, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-300">
      <HeaderAd />
      <Header onSearch={setSearchQuery} />
      
      <div className="w-full">
        <main className="w-full overflow-hidden">
          <div className="p-6 max-w-none">
            {/* Section Header */}
            <section className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Recent & Trending</h1>
            </section>

            {/* Filter Bar */}
            <div className="flex items-center space-x-4 mb-6">
              <Button 
                variant={selectedCategory === "all" ? "default" : "outline"}
                className="bg-cyan-500 hover:bg-cyan-600 text-white border-none"
                onClick={() => setSelectedCategory("all")}
                data-testid="all-videos-button"
              >
                All Videos
              </Button>
              
              <Button 
                variant="outline"
                className="text-white border-gray-600 hover:bg-gray-800"
                onClick={() => setSortBy(sortBy === "newest" ? "popular" : "newest")}
                data-testid="show-tags-button"
              >
                Show Tags
              </Button>
              
              {categories.map((category) => (
                <Button 
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  className={`${selectedCategory === category.name 
                    ? "bg-cyan-500 hover:bg-cyan-600 text-white border-none" 
                    : "text-white border-gray-600 hover:bg-gray-800"
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                  data-testid={`category-${category.slug}`}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Top Ad Slot */}
            <ImageAd 
              imageUrl="https://www.wordstream.com/wp-content/uploads/2021/07/banner-ads-examples-ncino.jpg"
              title="🔥 Premium Adult Entertainment"
              subtitle="Exclusive content • 4K Quality • Unlimited Access"
              cta="Join Now"
              className="h-32 mb-6"
            />
            <AdSlot position="top" className="mb-8" />

            {/* Video Grid */}
            {videosLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg shadow-sm animate-pulse">
                    <div className="aspect-video bg-gray-700 rounded-t-lg"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="h-3 bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 bg-gray-600 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <VideoGrid videos={filteredVideos} />
            )}

            {/* Mid Ad Slot */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-8">
              <ImageAd 
                imageUrl="https://www.wordstream.com/wp-content/uploads/2021/07/banner-ads-examples-ncino.jpg"
                title="Premium Access"
                subtitle="Unlimited streaming"
                className="h-48"
              />
              <ImageAd 
                imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO-m-_6OOa20rzN5-qUcyeQQU2i04HmI10_0o1rM2soZjnFlGWjzv7XlQ3mAH1fimkcg&usqp=CAU"
                title="Exclusive Content"
                subtitle="High quality videos"
                className="h-48"
              />
              <ImageAd 
                imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlmkMnipC8GGooa81DxOipkMvk78sGbVk1FA&s"
                title="Join Premium"
                subtitle="Members only access"
                className="h-48"
              />
            </div>

            {/* Load More Button */}
            {filteredVideos.length > 0 && (
              <div className="text-center mt-8">
                <Button 
                  className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  data-testid="load-more-button"
                >
                  Load More Videos
                </Button>
              </div>
            )}

            {/* Bottom Ad Slot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <ImageAd 
                imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO-m-_6OOa20rzN5-qUcyeQQU2i04HmI10_0o1rM2soZjnFlGWjzv7XlQ3mAH1fimkcg&usqp=CAU"
                title="Premium Videos"
                subtitle="Unlimited access to exclusive content"
                className="h-48"
              />
              <ImageAd 
                imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlmkMnipC8GGooa81DxOipkMvk78sGbVk1FA&s"
                title="Join Today"
                subtitle="Start your premium journey"
                className="h-48"
              />
            </div>
            
            {/* Final Banner */}
            <div className="mt-8">
              <ImageAd 
                imageUrl="https://www.wordstream.com/wp-content/uploads/2021/07/banner-ads-examples-ncino.jpg"
                title="Experience Premium Like Never Before"
                subtitle="Join thousands of satisfied members • 30-day money back guarantee"
                cta="Get Started Free"
                className="h-24"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
