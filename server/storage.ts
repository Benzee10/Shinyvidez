import { type Creator, type Video, type Category, type InsertCreator, type InsertVideo, type InsertCategory, type VideoWithCreator } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Creators
  getCreator(id: string): Promise<Creator | undefined>;
  getCreatorByUsername(username: string): Promise<Creator | undefined>;
  createCreator(creator: InsertCreator): Promise<Creator>;
  getAllCreators(): Promise<Creator[]>;

  // Videos
  getVideo(id: string): Promise<VideoWithCreator | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  getAllVideos(): Promise<VideoWithCreator[]>;
  getVideosByCreator(creatorId: string): Promise<VideoWithCreator[]>;
  getVideosByCategory(category: string): Promise<VideoWithCreator[]>;
  searchVideos(query: string): Promise<VideoWithCreator[]>;
  getRelatedVideos(videoId: string, limit?: number): Promise<VideoWithCreator[]>;

  // Categories
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  getAllCategories(): Promise<Category[]>;
}

export class MemStorage implements IStorage {
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
    // Initialize sample creators
    const sampleCreators: Creator[] = [
      {
        id: "creator-1",
        username: "techcoderpro",
        displayName: "TechCoder Pro",
        bio: "Full-stack developer sharing tutorials on modern web technologies. Helping developers build better applications with React, Node.js, and TypeScript.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        subscriberCount: 125000,
        verified: 1,
        createdAt: new Date("2022-01-15"),
      },
      {
        id: "creator-2",
        username: "natureshots",
        displayName: "NatureShots",
        bio: "Professional photographer capturing the beauty of nature. Sharing photography tips and techniques for stunning landscape shots.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c05e9e28?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        subscriberCount: 89000,
        verified: 1,
        createdAt: new Date("2021-08-22"),
      },
      {
        id: "creator-3",
        username: "chefmaster",
        displayName: "ChefMaster",
        bio: "Professional chef sharing culinary techniques and recipes. Learn to cook restaurant-quality dishes at home.",
        avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        subscriberCount: 156000,
        verified: 1,
        createdAt: new Date("2021-11-10"),
      },
      {
        id: "creator-4",
        username: "fitlifecoach",
        displayName: "FitLife Coach",
        bio: "Certified fitness trainer helping you achieve your health goals. High-intensity workouts and wellness tips.",
        avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
        subscriberCount: 203000,
        verified: 1,
        createdAt: new Date("2020-05-18"),
      },
    ];

    // Initialize sample categories
    const sampleCategories: Category[] = [
      { id: "cat-1", name: "Technology", slug: "technology", description: "Latest tech tutorials and reviews" },
      { id: "cat-2", name: "Education", slug: "education", description: "Educational content and tutorials" },
      { id: "cat-3", name: "Entertainment", slug: "entertainment", description: "Fun and entertaining videos" },
      { id: "cat-4", name: "Photography", slug: "photography", description: "Photography tips and techniques" },
      { id: "cat-5", name: "Cooking", slug: "cooking", description: "Culinary arts and cooking tutorials" },
      { id: "cat-6", name: "Fitness", slug: "fitness", description: "Workout routines and fitness tips" },
    ];

    // Initialize sample videos
    const sampleVideos: Video[] = [
      {
        id: "video-1",
        title: "Building Modern Web Applications with React and TypeScript",
        description: "In this comprehensive tutorial, we'll dive deep into building modern web applications using React and TypeScript. You'll learn best practices, advanced patterns, and how to create scalable, maintainable applications.",
        thumbnail: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
        videoUrl: "https://example.com/video1.mp4",
        duration: "12:34",
        viewCount: 45234,
        likeCount: 1200,
        creatorId: "creator-1",
        tags: ["React", "TypeScript", "Web Development", "Tutorial"],
        category: "Technology",
        publishedAt: new Date("2024-01-13"),
        createdAt: new Date("2024-01-13"),
      },
      {
        id: "video-2",
        title: "Photography Tips for Stunning Landscape Shots",
        description: "Learn professional techniques for capturing breathtaking landscape photographs. Discover composition rules, lighting techniques, and post-processing tips.",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
        videoUrl: "https://example.com/video2.mp4",
        duration: "8:42",
        viewCount: 128000,
        likeCount: 3400,
        creatorId: "creator-2",
        tags: ["Photography", "Nature", "Landscape", "Tutorial"],
        category: "Photography",
        publishedAt: new Date("2024-01-08"),
        createdAt: new Date("2024-01-08"),
      },
      {
        id: "video-3",
        title: "Master Chef Techniques: Perfect Pasta from Scratch",
        description: "Learn to make restaurant-quality pasta from scratch. Master chef shares professional techniques for creating perfect pasta dough and sauces.",
        thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
        videoUrl: "https://example.com/video3.mp4",
        duration: "15:23",
        viewCount: 89100,
        likeCount: 2800,
        creatorId: "creator-3",
        tags: ["Cooking", "Tutorial", "Pasta", "Italian"],
        category: "Cooking",
        publishedAt: new Date("2024-01-10"),
        createdAt: new Date("2024-01-10"),
      },
      {
        id: "video-4",
        title: "Full Body HIIT Workout - No Equipment Needed",
        description: "High-intensity interval training workout that targets your entire body. Perfect for home workouts with no equipment required.",
        thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
        videoUrl: "https://example.com/video4.mp4",
        duration: "22:18",
        viewCount: 234000,
        likeCount: 8900,
        creatorId: "creator-4",
        tags: ["Fitness", "HIIT", "Workout", "Home Exercise"],
        category: "Fitness",
        publishedAt: new Date("2024-01-10"),
        createdAt: new Date("2024-01-10"),
      },
      {
        id: "video-5",
        title: "Advanced React Hooks Tutorial",
        description: "Deep dive into advanced React hooks including useMemo, useCallback, useReducer, and custom hooks. Learn when and how to use them effectively.",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
        videoUrl: "https://example.com/video5.mp4",
        duration: "18:47",
        viewCount: 67000,
        likeCount: 2100,
        creatorId: "creator-1",
        tags: ["React", "Hooks", "JavaScript", "Advanced"],
        category: "Technology",
        publishedAt: new Date("2024-01-06"),
        createdAt: new Date("2024-01-06"),
      },
    ];

    // Store in maps
    sampleCreators.forEach(creator => this.creators.set(creator.id, creator));
    sampleCategories.forEach(category => this.categories.set(category.id, category));
    sampleVideos.forEach(video => this.videos.set(video.id, video));
  }

  // Creator methods
  async getCreator(id: string): Promise<Creator | undefined> {
    return this.creators.get(id);
  }

  async getCreatorByUsername(username: string): Promise<Creator | undefined> {
    return Array.from(this.creators.values()).find(
      (creator) => creator.username === username,
    );
  }

  async createCreator(insertCreator: InsertCreator): Promise<Creator> {
    const id = randomUUID();
    const creator: Creator = { 
      ...insertCreator,
      bio: insertCreator.bio || null,
      avatar: insertCreator.avatar || null,
      id,
      createdAt: new Date(),
      subscriberCount: insertCreator.subscriberCount || 0,
      verified: insertCreator.verified || 0,
    };
    this.creators.set(id, creator);
    return creator;
  }

  async getAllCreators(): Promise<Creator[]> {
    return Array.from(this.creators.values());
  }

  // Video methods
  async getVideo(id: string): Promise<VideoWithCreator | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const creator = this.creators.get(video.creatorId);
    if (!creator) return undefined;
    
    return { ...video, creator };
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = { 
      ...insertVideo,
      description: insertVideo.description || null,
      videoUrl: insertVideo.videoUrl || null,
      tags: insertVideo.tags || [],
      id,
      publishedAt: new Date(),
      createdAt: new Date(),
      viewCount: insertVideo.viewCount || 0,
      likeCount: insertVideo.likeCount || 0,
    };
    this.videos.set(id, video);
    return video;
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
    
    return result.sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime());
  }

  async getVideosByCreator(creatorId: string): Promise<VideoWithCreator[]> {
    const videos = Array.from(this.videos.values()).filter(v => v.creatorId === creatorId);
    const creator = this.creators.get(creatorId);
    if (!creator) return [];
    
    return videos.map(video => ({ ...video, creator }))
      .sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime());
  }

  async getVideosByCategory(category: string): Promise<VideoWithCreator[]> {
    const videos = Array.from(this.videos.values()).filter(v => v.category === category);
    const result: VideoWithCreator[] = [];
    
    for (const video of videos) {
      const creator = this.creators.get(video.creatorId);
      if (creator) {
        result.push({ ...video, creator });
      }
    }
    
    return result.sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime());
  }

  async searchVideos(query: string): Promise<VideoWithCreator[]> {
    const lowerQuery = query.toLowerCase();
    const videos = Array.from(this.videos.values()).filter(video => 
      video.title.toLowerCase().includes(lowerQuery) ||
      video.description?.toLowerCase().includes(lowerQuery) ||
      (Array.isArray(video.tags) && video.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery)))
    );
    
    const result: VideoWithCreator[] = [];
    for (const video of videos) {
      const creator = this.creators.get(video.creatorId);
      if (creator) {
        result.push({ ...video, creator });
      }
    }
    
    return result.sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime());
  }

  async getRelatedVideos(videoId: string, limit = 6): Promise<VideoWithCreator[]> {
    const currentVideo = this.videos.get(videoId);
    if (!currentVideo) return [];
    
    const relatedVideos = Array.from(this.videos.values())
      .filter(v => v.id !== videoId && v.category === currentVideo.category)
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
  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { 
      ...insertCategory, 
      description: insertCategory.description || null,
      id 
    };
    this.categories.set(id, category);
    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
}

export const storage = new MemStorage();
