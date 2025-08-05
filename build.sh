#!/bin/bash

# Install dependencies
npm install

# Build the frontend
npm run build

# Ensure API directory exists
mkdir -p api

# Copy the built server to API directory for Vercel
cp dist/index.js api/index.js

echo "Build completed successfully!"