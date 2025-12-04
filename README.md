# Temp Mail - React + Vite + Tailwind

A disposable email inbox service with Gmail-style UI, built with React, Vite, and Tailwind CSS.

## Features

- Generate temporary email addresses
- Gmail-like 3-column layout
- Real-time message polling
- HTML email rendering
- Responsive design

## Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

**⚠️ IMPORTANT: You must run BOTH servers for the app to work!**

1. **Start the backend API server** (Terminal 1):
```bash
npm run server
```
This starts the Express server on `http://localhost:3000`

2. **Start the Vite dev server** (Terminal 2):
```bash
npm run dev
```
This starts the frontend on `http://localhost:5173`

The app will be available at `http://localhost:5173`

**Note**: The Vite dev server automatically proxies all `/api/*` requests to `http://localhost:3000`. If you see 404 errors for API endpoints, make sure the Express server (port 3000) is running!

## Production

### Build

```bash
npm run build
```

### Run Production Server

```bash
NODE_ENV=production npm start
```

The server will serve the React build from the `dist` folder.

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Backend**: Express.js
- **Email Service**: mail.tm API

