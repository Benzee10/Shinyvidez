import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Video, Creator, VideoWithCreator } from '@shared/schema';

interface VideoMarkdown {
  title: string;
  thumbnail: string;
  videoUrl?: string;
  embedUrl?: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  creator: string;
  tags: string[];
  category: string;
  publishedAt: string;
  content: string;
  slug: string;
  categorySlug: string;
}

const creators: Map<string, Creator> = new Map([
  ['TechCoder Pro', {
    id: 'creator-1',
    username: 'techcoderpro',
    displayName: 'TechCoder Pro',
    bio: 'Full-stack developer sharing tutorials on modern web technologies. Helping developers build better applications with React, Node.js, and TypeScript.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64',
    subscriberCount: 125000,
    verified: 1,
    createdAt: new Date('2022-01-15'),
  }],
  ['NatureShots', {
    id: 'creator-2',
    username: 'natureshots',
    displayName: 'NatureShots',
    bio: 'Professional photographer capturing the beauty of nature. Sharing photography tips and techniques for stunning landscape shots.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c05e9e28?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64',
    subscriberCount: 89000,
    verified: 1,
    createdAt: new Date('2021-08-22'),
  }],
  ['ChefMaster', {
    id: 'creator-3',
    username: 'chefmaster',
    displayName: 'ChefMaster',
    bio: 'Professional chef sharing culinary techniques and recipes. Learn to cook restaurant-quality dishes at home.',
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64',
    subscriberCount: 156000,
    verified: 1,
    createdAt: new Date('2021-11-10'),
  }],
  ['FitLife Coach', {
    id: 'creator-4',
    username: 'fitlifecoach',
    displayName: 'FitLife Coach',
    bio: 'Certified fitness trainer helping you achieve your health goals. High-intensity workouts and wellness tips.',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64',
    subscriberCount: 203000,
    verified: 1,
    createdAt: new Date('2020-05-18'),
  }],
]);

export function loadVideosFromMarkdown(): VideoWithCreator[] {
  const dataDir = path.join(process.cwd(), 'data');
  const videos: VideoWithCreator[] = [];

  if (!fs.existsSync(dataDir)) {
    return videos;
  }

  const categories = fs.readdirSync(dataDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const categorySlug of categories) {
    const categoryPath = path.join(dataDir, categorySlug);
    const items = fs.readdirSync(categoryPath, { withFileTypes: true });

    for (const item of items) {
      let videoPath: string;
      let videoSlug: string;

      if (item.isDirectory()) {
        // Handle folder-based videos (existing structure)
        videoSlug = item.name;
        videoPath = path.join(categoryPath, videoSlug, 'index.md');
      } else if (item.isFile() && item.name.endsWith('.md')) {
        // Handle direct .md files in category folder
        videoSlug = item.name.replace('.md', '');
        videoPath = path.join(categoryPath, item.name);
      } else {
        continue; // Skip non-markdown files
      }
      
      if (fs.existsSync(videoPath)) {
        try {
          const fileContent = fs.readFileSync(videoPath, 'utf-8');
          const { data, content } = matter(fileContent);
          
          const creatorName = data.creator as string;
          const creator = creators.get(creatorName);
          
          if (!creator) {
            console.warn(`Creator "${creatorName}" not found for video "${data.title}"`);
            continue;
          }

          const video: VideoWithCreator = {
            id: `${categorySlug}-${videoSlug}`,
            title: data.title,
            thumbnail: data.thumbnail,
            videoUrl: data.videoUrl || null,
            embedUrl: data.embedUrl || null,
            duration: data.duration,
            viewCount: data.viewCount || 0,
            likeCount: data.likeCount || 0,
            creatorId: creator.id,
            tags: data.tags || [],
            category: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
            publishedAt: new Date(data.publishedAt),
            createdAt: new Date(data.publishedAt),
            creator: creator,
          };

          videos.push(video);
        } catch (error) {
          console.error(`Error loading video from ${videoPath}:`, error);
        }
      }
    }
  }

  return videos.sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime());
}

export function getCreators(): Creator[] {
  return Array.from(creators.values());
}