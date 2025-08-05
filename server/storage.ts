import { type Creator, type Video, type Category, type InsertCreator, type InsertVideo, type InsertCategory, type VideoWithCreator } from "@shared/schema";
import { randomUUID } from "crypto";
import { loadVideosFromMarkdown, getCreators } from "./markdown-loader";

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
    // Load creators from markdown loader
    const markdownCreators = getCreators();
    markdownCreators.forEach(creator => this.creators.set(creator.id, creator));

    // Initialize categories
    const sampleCategories: Category[] = [
      { id: "cat-1", name: "Technology", slug: "technology", description: "Latest tech tutorials and reviews" },
      { id: "cat-2", name: "Photography", slug: "photography", description: "Photography tips and techniques" },
      { id: "cat-3", name: "Cooking", slug: "cooking", description: "Culinary arts and cooking tutorials" },
      { id: "cat-4", name: "Fitness", slug: "fitness", description: "Workout routines and fitness tips" },
    ];

    // Store categories in map
    sampleCategories.forEach(category => this.categories.set(category.id, category));

    // Load videos from markdown files
    const markdownVideos = loadVideosFromMarkdown();
    markdownVideos.forEach(video => {
      const videoData: Video = {
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        videoUrl: video.videoUrl,
        embedUrl: video.embedUrl,
        duration: video.duration,
        viewCount: video.viewCount,
        likeCount: video.likeCount,
        creatorId: video.creatorId,
        tags: video.tags,
        category: video.category,
        publishedAt: video.publishedAt,
        createdAt: video.createdAt,
      };
      this.videos.set(video.id, videoData);
    });
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
      videoUrl: insertVideo.videoUrl || null,
      embedUrl: insertVideo.embedUrl || null,
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
