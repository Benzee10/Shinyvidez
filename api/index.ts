// Vercel serverless function entry point
import express from "express";
import { createServer } from "http";
import { storage } from './storage.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.get("/api/videos", async (req, res) => {
  try {
    const { category, creator, search } = req.query;
    let videos;
    
    if (search) {
      videos = await storage.searchVideos(search as string);
    } else if (category) {
      videos = await storage.getVideosByCategory(category as string);
    } else if (creator) {
      videos = await storage.getVideosByCreator(creator as string);
    } else {
      videos = await storage.getAllVideos();
    }
    
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

app.get("/api/videos/:id", async (req, res) => {
  try {
    const video = await storage.getVideo(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

app.get("/api/videos/:id/related", async (req, res) => {
  try {
    const relatedVideos = await storage.getRelatedVideos(req.params.id);
    res.json(relatedVideos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch related videos" });
  }
});

app.get("/api/creators", async (req, res) => {
  try {
    const creators = await storage.getAllCreators();
    res.json(creators);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch creators" });
  }
});

app.get("/api/creators/:id", async (req, res) => {
  try {
    const creator = await storage.getCreator(req.params.id);
    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }
    res.json(creator);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch creator" });
  }
});

app.get("/api/creators/username/:username", async (req, res) => {
  try {
    const creator = await storage.getCreatorByUsername(req.params.username);
    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }
    res.json(creator);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch creator" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await storage.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Error handling middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;