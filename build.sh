#!/bin/bash

# Install dependencies
npm install

# Build only the frontend for Vercel (no backend bundling)
vite build

# Remove any server files from dist to prevent conflicts
rm -f dist/index.js
rm -f dist/public/index.js

echo "Frontend build completed successfully!"