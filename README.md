# Video Streaming Platform

A modern video streaming platform with a dark theme interface focused on video content discovery.

## Features

- Clean, responsive video grid layout
- Video player with related content
- Category filtering and search
- Sticky video widget with random video rotation
- Daily popup modal
- Advertisement integration
- Dark theme interface

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

## Deployment on Vercel

This project is configured for easy deployment on Vercel:

1. **Connect Repository**: Link your Git repository to Vercel
2. **Environment Variables**: Set up any required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy using the provided configuration

### Build Configuration

- `vercel.json`: Main deployment configuration
- `build.sh`: Build script for production
- `.vercelignore`: Files to exclude from deployment

### Environment Variables

If using a PostgreSQL database, add:
- `DATABASE_URL`: Your PostgreSQL connection string

## Local Development

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── routes.ts          # API routes
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
├── data/                  # Content data
└── api/                   # Vercel API functions
```