import { randomUUID } from "crypto";

// In-memory creators data
const creators = new Map([
  ["TechCoder Pro", {
    id: "creator-1",
    username: "techcoderpro",
    displayName: "TechCoder Pro",
    bio: "Full-stack developer sharing tutorials on modern web technologies. Helping developers build better applications with React, Node.js, and TypeScript.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
    subscriberCount: 125000,
    verified: 1,
    createdAt: new Date("2022-01-15")
  }],
  ["NatureShots", {
    id: "creator-2",
    username: "natureshots",
    displayName: "NatureShots",
    bio: "Professional photographer capturing the beauty of nature. Sharing photography tips and techniques for stunning landscape shots.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c05e9e28?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
    subscriberCount: 89000,
    verified: 1,
    createdAt: new Date("2021-08-22")
  }],
  ["ChefMaster", {
    id: "creator-3",
    username: "chefmaster",
    displayName: "ChefMaster",
    bio: "Professional chef sharing culinary techniques and recipes. Learn to cook restaurant-quality dishes at home.",
    avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
    subscriberCount: 156000,
    verified: 1,
    createdAt: new Date("2021-11-10")
  }],
  ["FitLife Coach", {
    id: "creator-4",
    username: "fitlifecoach",
    displayName: "FitLife Coach",
    bio: "Certified fitness trainer helping you achieve your health goals. High-intensity workouts and wellness tips.",
    avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
    subscriberCount: 203000,
    verified: 1,
    createdAt: new Date("2020-05-18")
  }]
]);

// Sample videos data for Vercel deployment
const sampleVideos = [
  {
    id: "technology-ai-chatbot",
    title: "Building AI Chatbots with OpenAI",
    thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
    videoUrl: null,
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "15:30",
    viewCount: 45231,
    likeCount: 2341,
    creatorId: "creator-1",
    tags: ["AI", "ChatGPT", "Programming", "Tutorial"],
    category: "Technology",
    publishedAt: new Date("2024-01-15"),
    createdAt: new Date("2024-01-15")
  },
  {
    id: "photography-landscape",
    title: "Perfect Landscape Photography Tips",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
    videoUrl: null,
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "22:45",
    viewCount: 32891,
    likeCount: 1876,
    creatorId: "creator-2",
    tags: ["Photography", "Landscape", "Nature", "Tips"],
    category: "Photography",
    publishedAt: new Date("2024-01-10"),
    createdAt: new Date("2024-01-10")
  }
];

function getCreators() {
  return Array.from(creators.values());
}

interface Creator {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  subscriberCount: number;
  verified: number;
  createdAt: Date;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string | null;
  embedUrl: string | null;
  duration: string;
  viewCount: number;
  likeCount: number;
  creatorId: string;
  tags: string[];
  category: string;
  publishedAt: Date;
  createdAt: Date;
}

interface VideoWithCreator extends Video {
  creator: Creator;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export class MemStorage {
  private creators: Map<string, Creator>;
  private videos: Map<string, Video>;
  private categories: Map<string, Category>;

  constructor() {
    this.creators = new Map();
    this.videos = new Map();
    this.categories = new Map();
    this.initializeData();
  }

  private initializeData() {
    const markdownCreators = getCreators();
    markdownCreators.forEach((creator) => this.creators.set(creator.id, creator));

    const sampleCategories = [
      { id: "cat-1", name: "Technology", slug: "technology", description: "Latest tech tutorials and reviews" },
      { id: "cat-2", name: "Photography", slug: "photography", description: "Photography tips and techniques" },
      { id: "cat-3", name: "Cooking", slug: "cooking", description: "Culinary arts and cooking tutorials" },
      { id: "cat-4", name: "Fitness", slug: "fitness", description: "Workout routines and fitness tips" }
    ];
    sampleCategories.forEach((category) => this.categories.set(category.id, category));

    // Use sample videos for Vercel deployment
    sampleVideos.forEach((video) => {
      this.videos.set(video.id, video);
    });
  }

  // Creator methods
  async getCreator(id: string) {
    return this.creators.get(id);
  }

  async getCreatorByUsername(username: string) {
    return Array.from(this.creators.values()).find(
      (creator) => creator.username === username
    );
  }

  async getAllCreators() {
    return Array.from(this.creators.values());
  }

  // Video methods
  async getVideo(id: string) {
    const video = this.videos.get(id);
    if (!video) return undefined;
    const creator = this.creators.get(video.creatorId);
    if (!creator) return undefined;
    return { ...video, creator };
  }

  async getAllVideos(): Promise<VideoWithCreator[]> {
    const videos = Array.from(this.videos.values());
    const result: VideoWithCreator[] = [];
    for (const video of videos) {
      const creator = this.creators.get(video.creatorId);
      if (creator) {
        result.push({ ...video, creator });
      }
    }
    return result.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getVideosByCreator(creatorId: string): Promise<VideoWithCreator[]> {
    const videos = Array.from(this.videos.values()).filter((v) => v.creatorId === creatorId);
    const creator = this.creators.get(creatorId);
    if (!creator) return [];
    return videos.map((video) => ({ ...video, creator }))
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getVideosByCategory(category: string): Promise<VideoWithCreator[]> {
    const videos = Array.from(this.videos.values()).filter((v) => v.category === category);
    const result: VideoWithCreator[] = [];
    for (const video of videos) {
      const creator = this.creators.get(video.creatorId);
      if (creator) {
        result.push({ ...video, creator });
      }
    }
    return result.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async searchVideos(query: string): Promise<VideoWithCreator[]> {
    const lowerQuery = query.toLowerCase();
    const videos = Array.from(this.videos.values()).filter(
      (video) => 
        video.title.toLowerCase().includes(lowerQuery) ||
        (Array.isArray(video.tags) && video.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery)))
    );
    const result: VideoWithCreator[] = [];
    for (const video of videos) {
      const creator = this.creators.get(video.creatorId);
      if (creator) {
        result.push({ ...video, creator });
      }
    }
    return result.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getRelatedVideos(videoId: string, limit = 6): Promise<VideoWithCreator[]> {
    const currentVideo = this.videos.get(videoId);
    if (!currentVideo) return [];

    const relatedVideos = Array.from(this.videos.values())
      .filter((v) => v.id !== videoId && v.category === currentVideo.category)
      .slice(0, limit);

    const result: VideoWithCreator[] = [];
    for (const video of relatedVideos) {
      const creator = this.creators.get(video.creatorId);
      if (creator) {
        result.push({ ...video, creator });
      }
    }
    return result;
  }

  // Category methods
  async getCategory(id: string) {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string) {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async getAllCategories() {
    return Array.from(this.categories.values());
  }
}

export const storage = new MemStorage();