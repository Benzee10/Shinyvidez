// This file contains sample data structure for reference
// The actual data is initialized in server/storage.ts

export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  creatorId: string;
  tags: string[];
  category: string;
  publishedAt: Date;
}

export interface CreatorData {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  subscriberCount: number;
  verified: boolean;
  createdAt: Date;
}

// Sample data structure - this is implemented in the MemStorage class
export const sampleVideos: VideoData[] = [
  {
    id: "video-1",
    title: "Building Modern Web Applications with React and TypeScript",
    description: "In this comprehensive tutorial, we'll dive deep into building modern web applications using React and TypeScript.",
    thumbnail: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
    duration: "12:34",
    viewCount: 45234,
    likeCount: 1200,
    creatorId: "creator-1",
    tags: ["React", "TypeScript", "Web Development", "Tutorial"],
    category: "Technology",
    publishedAt: new Date("2024-01-13"),
  },
  // Additional sample videos would go here...
];
