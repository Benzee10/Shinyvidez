# Video Streaming Platform

## Overview

This is a modern video streaming platform built with React and Express, designed as a high-performance media sharing application. The platform features a YouTube-style interface with video browsing, creator profiles, search functionality, and responsive design. The application uses a full-stack TypeScript architecture with a React frontend, Express backend, and PostgreSQL database for scalable media content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with **React + Vite** for fast development and optimal performance. The frontend uses **Wouter** for lightweight routing, enabling navigation between home, video detail, and creator profile pages. State management is handled through **TanStack Query** for server state synchronization and caching, providing efficient data fetching and background updates.

**UI Framework**: The application leverages **shadcn/ui** components built on **Radix UI primitives** with **Tailwind CSS** for styling. This combination provides accessible, customizable components with a modern design system. The design supports both light and dark themes via **next-themes** integration.

**Component Structure**: The architecture follows a modular component approach with reusable UI components (video cards, search bars, navigation), layout components (header, sidebar), and page-level components. The video grid system adapts responsively across different screen sizes.

### Backend Architecture
The server uses **Express.js** with TypeScript for type safety and developer experience. The architecture implements a RESTful API design with clear separation of concerns between routing, business logic, and data access layers.

**API Design**: The backend exposes endpoints for videos (`/api/videos`), creators (`/api/creators`), and categories with support for filtering, searching, and related content discovery. The API supports query parameters for category filtering, creator filtering, and full-text search functionality.

**Development Setup**: The server integrates with Vite in development mode for hot module replacement and serves the built React application in production. This enables a seamless full-stack development experience.

### Data Storage Solutions
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations. The database schema is defined in TypeScript with automatic type generation for full-stack type safety.

**Schema Design**: The data model includes three main entities - creators, videos, and categories. Videos are linked to creators through foreign key relationships, and support JSONB storage for flexible tag arrays. The schema supports essential metadata like view counts, like counts, publication dates, and verification status.

**Development Storage**: For development and testing, the application includes an in-memory storage implementation (`MemStorage`) that mimics the database interface, allowing rapid prototyping without database setup requirements.

### Authentication and Authorization
The current architecture includes placeholder middleware for session management and request logging. The session handling uses `connect-pg-simple` for PostgreSQL-backed session storage, though full authentication implementation is not yet completed in this codebase.

## External Dependencies

### Database Infrastructure
- **Neon Database**: PostgreSQL hosting service configured via `@neondatabase/serverless`
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Comprehensive primitive component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: Animation library for smooth UI transitions (configured but not extensively used)
- **Embla Carousel**: Touch-friendly carousel component for video galleries

### Development and Build Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: High-performance bundling for production builds

### Hosting and Deployment
- **Vercel**: Fully configured for serverless deployment with automatic builds
  - `vercel.json`: Main deployment configuration with API routing
  - `build.sh`: Production build script
  - `.vercelignore`: Deployment exclusions
  - `api/index.js`: Serverless function entry point for Express backend
- **Replit**: Development environment support with runtime error handling

### Media and Content Management
The platform is designed to support various video sources including embedded iframes (for external video platforms) and direct video file hosting. The content structure supports thumbnail images, duration metadata, and flexible tagging systems for content categorization and discovery.

### Advertisement Integration
- **Sticky Video Widget**: Random video rotation with overlay redirects to external sites
- **Daily Popup Modal**: Appears once per day with 10-second delay
- **Bottom Ad on Video Pages**: Single advertisement placement in video watch page sidebar
- **Clean Homepage**: All ads removed from homepage for focus on video content

### Search and Performance
The application includes client-side search functionality with plans for more sophisticated search implementations. The architecture supports both simple text matching and fuzzy search capabilities, with the foundation laid for integrating advanced search libraries like Fuse.js.

## Recent Changes (January 2025)

### Vercel Deployment Optimization
- **Complete serverless architecture**: Created isolated `/api/index.ts` as dedicated Vercel serverless function entry point
- **Data layer separation**: Implemented `/api/storage.ts` with in-memory storage and proper TypeScript interfaces
- **Build configuration fixes**: Separated frontend (`dist/public`) and backend (serverless functions) to prevent source code exposure
- **Frontend/Backend separation**: Fixed build script to only build React frontend for static deployment, preventing server code from being served as static files
- **Fixed React performance**: Resolved infinite re-render issues using `useMemo` instead of problematic `useEffect` patterns
- **Configuration updates**: Updated `vercel.json` with proper runtime (`@vercel/node@4.0.0`) and routing for serverless deployment
- **Migration completed**: Successfully migrated from Replit Agent to Replit environment with full compatibility
- **Deployment ready**: Resolved issue where backend JavaScript was being served instead of React app frontend