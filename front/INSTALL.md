# Installation Guide

## Required npm Packages

Run these commands in the `front` directory to install all dependencies:

```bash
cd front

# Install all dependencies at once (recommended)
npm install

# OR install individually:
npm install firebase
npm install framer-motion
npm install react-router-dom
npm install axios
```

## What Each Package Does

1. **firebase** - Firebase SDK for authentication (Google OAuth)
2. **framer-motion** - Animation library for smooth UI animations
3. **react-router-dom** - Routing for navigation between pages
4. **axios** - HTTP client for API calls (already installed)

## Quick Setup

```bash
# Navigate to frontend directory
cd front

# Install all dependencies
npm install

# Start development server
npm run dev
```

## After Installation

1. Create `.env` file from `.env.example`
2. Add your Firebase credentials
3. Run `npm run dev`

That's it! All packages are now in `package.json`, so `npm install` will install everything automatically.

