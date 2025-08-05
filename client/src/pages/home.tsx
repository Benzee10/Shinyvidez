import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { VideoWithCreator, Category } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { VideoGrid } from "@/components/video/video-grid";
import { AdSlot } from "@/components/ads/ad-slot";
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header onSearch={setSearchQuery} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-hidden">
          <div className="p-6">
            {/* Hero Section */}
            <section className="mb-8">
              <div className="relative bg-gradient-to-r from-red-500 to-teal-400 rounded-2xl p-8 text-white overflow-hidden">
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold mb-4">Discover Amazing Content</h1>
                  <p className="text-xl mb-6 opacity-90">
                    Explore thousands of high-quality videos from talented creators worldwide
                  </p>
                  <Button 
                    className="bg-white text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    data-testid="start-watching-button"
                  >
                    Start Watching
                  </Button>
                </div>
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </section>

            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48" data-testid="category-select">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48" data-testid="sort-select">
                    <SelectValue placeholder="Sort by Newest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Sort by Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="liked">Most Liked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline"
                className="flex items-center space-x-2"
                data-testid="filter-button"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
            </div>

            {/* Top Ad Slot */}
            <AdSlot position="top" className="mb-8" />

            {/* Video Grid */}
            {videosLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
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
              <VideoGrid videos={filteredVideos} />
            )}

            {/* Mid Ad Slot */}
            <AdSlot position="middle" className="my-8" />

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
            <AdSlot position="bottom" className="mt-8" />
          </div>
        </main>
      </div>
    </div>
  );
}
