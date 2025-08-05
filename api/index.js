// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";

// server/markdown-loader.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
var creators = /* @__PURE__ */ new Map([
  ["TechCoder Pro", {
    id: "creator-1",
    username: "techcoderpro",
    displayName: "TechCoder Pro",
    bio: "Full-stack developer sharing tutorials on modern web technologies. Helping developers build better applications with React, Node.js, and TypeScript.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
    subscriberCount: 125e3,
    verified: 1,
    createdAt: /* @__PURE__ */ new Date("2022-01-15")
  }],
  ["NatureShots", {
    id: "creator-2",
    username: "natureshots",
    displayName: "NatureShots",
    bio: "Professional photographer capturing the beauty of nature. Sharing photography tips and techniques for stunning landscape shots.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c05e9e28?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
    subscriberCount: 89e3,
    verified: 1,
    createdAt: /* @__PURE__ */ new Date("2021-08-22")
  }],
  ["ChefMaster", {
    id: "creator-3",
    username: "chefmaster",
    displayName: "ChefMaster",
    bio: "Professional chef sharing culinary techniques and recipes. Learn to cook restaurant-quality dishes at home.",
    avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
    subscriberCount: 156e3,
    verified: 1,
    createdAt: /* @__PURE__ */ new Date("2021-11-10")
  }],
  ["FitLife Coach", {
    id: "creator-4",
    username: "fitlifecoach",
    displayName: "FitLife Coach",
    bio: "Certified fitness trainer helping you achieve your health goals. High-intensity workouts and wellness tips.",
    avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
    subscriberCount: 203e3,
    verified: 1,
    createdAt: /* @__PURE__ */ new Date("2020-05-18")
  }]
]);
function loadVideosFromMarkdown() {
  const dataDir = path.join(process.cwd(), "data");
  const videos = [];
  if (!fs.existsSync(dataDir)) {
    return videos;
  }
  const categories = fs.readdirSync(dataDir, { withFileTypes: true }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
  for (const categorySlug of categories) {
    const categoryPath = path.join(dataDir, categorySlug);
    const items = fs.readdirSync(categoryPath, { withFileTypes: true });
    for (const item of items) {
      let videoPath;
      let videoSlug;
      if (item.isDirectory()) {
        videoSlug = item.name;
        videoPath = path.join(categoryPath, videoSlug, "index.md");
      } else if (item.isFile() && item.name.endsWith(".md")) {
        videoSlug = item.name.replace(".md", "");
        videoPath = path.join(categoryPath, item.name);
      } else {
        continue;
      }
      if (fs.existsSync(videoPath)) {
        try {
          const fileContent = fs.readFileSync(videoPath, "utf-8");
          const { data, content } = matter(fileContent);
          const creatorName = data.creator;
          const creator = creators.get(creatorName);
          if (!creator) {
            console.warn(`Creator "${creatorName}" not found for video "${data.title}"`);
            continue;
          }
          const video = {
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
            creator
          };
          videos.push(video);
        } catch (error) {
          console.error(`Error loading video from ${videoPath}:`, error);
        }
      }
    }
  }
  return videos.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}
function getCreators() {
  return Array.from(creators.values());
}

// server/storage.ts
var MemStorage = class {
  creators;
  videos;
  categories;
  constructor() {
    this.creators = /* @__PURE__ */ new Map();
    this.videos = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.initializeData();
  }
  initializeData() {
    const markdownCreators = getCreators();
    markdownCreators.forEach((creator) => this.creators.set(creator.id, creator));
    const sampleCategories = [
      { id: "cat-1", name: "Technology", slug: "technology", description: "Latest tech tutorials and reviews" },
      { id: "cat-2", name: "Photography", slug: "photography", description: "Photography tips and techniques" },
      { id: "cat-3", name: "Cooking", slug: "cooking", description: "Culinary arts and cooking tutorials" },
      { id: "cat-4", name: "Fitness", slug: "fitness", description: "Workout routines and fitness tips" }
    ];
    sampleCategories.forEach((category) => this.categories.set(category.id, category));
    const markdownVideos = loadVideosFromMarkdown();
    markdownVideos.forEach((video) => {
      const videoData = {
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
        createdAt: video.createdAt
      };
      this.videos.set(video.id, videoData);
    });
  }
  // Creator methods
  async getCreator(id) {
    return this.creators.get(id);
  }
  async getCreatorByUsername(username) {
    return Array.from(this.creators.values()).find(
      (creator) => creator.username === username
    );
  }
  async createCreator(insertCreator) {
    const id = randomUUID();
    const creator = {
      ...insertCreator,
      bio: insertCreator.bio || null,
      avatar: insertCreator.avatar || null,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      subscriberCount: insertCreator.subscriberCount || 0,
      verified: insertCreator.verified || 0
    };
    this.creators.set(id, creator);
    return creator;
  }
  async getAllCreators() {
    return Array.from(this.creators.values());
  }
  // Video methods
  async getVideo(id) {
    const video = this.videos.get(id);
    if (!video) return void 0;
    const creator = this.creators.get(video.creatorId);
    if (!creator) return void 0;
    return { ...video, creator };
  }
  async createVideo(insertVideo) {
    const id = randomUUID();
    const video = {
      ...insertVideo,
      videoUrl: insertVideo.videoUrl || null,
      embedUrl: insertVideo.embedUrl || null,
      tags: insertVideo.tags || [],
      id,
      publishedAt: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date(),
      viewCount: insertVideo.viewCount || 0,
      likeCount: insertVideo.likeCount || 0
    };
    this.videos.set(id, video);
    return video;
  }
  async getAllVideos() {
    const videos = Array.from(this.videos.values());
    const result = [];
    for (const video of videos) {
      const creator = this.creators.get(video.creatorId);
      if (creator) {
        result.push({ ...video, creator });
      }
    }
    return result.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  async getVideosByCreator(creatorId) {
    const videos = Array.from(this.videos.values()).filter((v) => v.creatorId === creatorId);
    const creator = this.creators.get(creatorId);
    if (!creator) return [];
    return videos.map((video) => ({ ...video, creator })).sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  async getVideosByCategory(category) {
    const videos = Array.from(this.videos.values()).filter((v) => v.category === category);
    const result = [];
    for (const video of videos) {
      const creator = this.creators.get(video.creatorId);
      if (creator) {
        result.push({ ...video, creator });
      }
    }
    return result.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  async searchVideos(query) {
    const lowerQuery = query.toLowerCase();
    const videos = Array.from(this.videos.values()).filter(
      (video) => video.title.toLowerCase().includes(lowerQuery) || Array.isArray(video.tags) && video.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
    const result = [];
    for (const video of videos) {
      const creator = this.creators.get(video.creatorId);
      if (creator) {
        result.push({ ...video, creator });
      }
    }
    return result.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  async getRelatedVideos(videoId, limit = 6) {
    const currentVideo = this.videos.get(videoId);
    if (!currentVideo) return [];
    const relatedVideos = Array.from(this.videos.values()).filter((v) => v.id !== videoId && v.category === currentVideo.category).slice(0, limit);
    const result = [];
    for (const video of relatedVideos) {
      const creator = this.creators.get(video.creatorId);
      if (creator) {
        result.push({ ...video, creator });
      }
    }
    return result;
  }
  // Category methods
  async getCategory(id) {
    return this.categories.get(id);
  }
  async getCategoryBySlug(slug) {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }
  async createCategory(insertCategory) {
    const id = randomUUID();
    const category = {
      ...insertCategory,
      description: insertCategory.description || null,
      id
    };
    this.categories.set(id, category);
    return category;
  }
  async getAllCategories() {
    return Array.from(this.categories.values());
  }
};
var storage = new MemStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/videos", async (req, res) => {
    try {
      const { category, creator, search } = req.query;
      let videos;
      if (search) {
        videos = await storage.searchVideos(search);
      } else if (category) {
        videos = await storage.getVideosByCategory(category);
      } else if (creator) {
        videos = await storage.getVideosByCreator(creator);
      } else {
        videos = await storage.getAllVideos();
      }
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });
  app2.get("/api/videos/:id", async (req, res) => {
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
  app2.get("/api/videos/:id/related", async (req, res) => {
    try {
      const relatedVideos = await storage.getRelatedVideos(req.params.id);
      res.json(relatedVideos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch related videos" });
    }
  });
  app2.get("/api/creators", async (req, res) => {
    try {
      const creators2 = await storage.getAllCreators();
      res.json(creators2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch creators" });
    }
  });
  app2.get("/api/creators/:id", async (req, res) => {
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
  app2.get("/api/creators/username/:username", async (req, res) => {
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
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  app2.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  if (process.env.VERCEL) {
    return app;
  } else {
    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`serving on port ${port}`);
    });
  }
})();
var index_default = app;
export {
  index_default as default
};
