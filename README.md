# TempChat - Secure Temporary Chat Rooms ⚡

TempChat is a modern, real-time web application where users can create password-protected chat rooms that automatically expire after a set time. Built with React 19, TailwindCSS, Express 5, Node.js, Socket.io, and a self-contained SQLite database.

## Features

- **Real-time Messaging**: Instant, low-latency communication via WebSockets (Socket.io).
- **Temporary Rooms**: Rooms expire automatically after a specified time frame (e.g., 5 mins to 24 hours).
- **Real-time Live Countdown**: Dynamic timer showing remaining time before room destruction.
- **Password Protection**: Secure your rooms with passwords.
- **Message Reactions**: React to specific messages with emojis (👍 ❤️ 😂 🔥 🎉).
- **Typing Indicators**: See when others are typing in real-time.
- **Activity Dashboard**: View room stats, creator name, active user count, and time remaining.
- **Dark / Light Mode**: Seamlessly toggle between dark and light themes (preference saved).
- **Zero Config Database**: SQLite runs locally and self-cleans expired rooms every 60 seconds.
- **Single-Service Deployable**: Backend automatically builds and serves the frontend in production.

---

## Folder Structure

```
tempchat/
├── backend/
│   ├── config/          # SQLite DB connection (data/tempchat.db)
│   ├── controllers/     # API logic (createRoom, joinRoom, getRoomInfo)
│   ├── models/          # Room model with auto-cleanup
│   ├── routes/          # Express route definitions
│   ├── socket/          # Socket.io real-time chat handlers
│   ├── .env             # Backend environment variables
│   └── server.js        # Main entry point & static frontend server
├── frontend/
│   ├── src/
│   │   ├── components/  # ChatBox, CreateRoom, JoinRoom, Dashboard, Message
│   │   ├── pages/       # Home, ChatRoom
│   │   ├── App.jsx      # React router & theme layout
│   │   └── index.css    # Tailwind directives & styles
│   ├── index.html       # Vite entry HTML
│   └── vite.config.js
├── package.json         # Root monorepo scripts
├── render.yaml          # 1-Click Render blueprint
└── README.md
```

---

## Quick Start (Local Development)

### 1. Install All Dependencies
From the repository root:
```bash
npm run install:all
```

### 2. Build Frontend & Run Full-Stack App
```bash
npm run build
npm start
```
Open your browser to `http://localhost:5000`.

### Or Run in Hot-Reload Development Mode:
In terminal 1 (Backend):
```bash
npm run dev:backend
```
In terminal 2 (Frontend):
```bash
npm run dev:frontend
```
Open `http://localhost:5173`.

---

## Free Online Deployment

### Option A: Render (Easiest - 1 Web Service for Everything)
1. Push this repository to your GitHub account (`https://github.com/anirudh828/TempChat`).
2. Go to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Web Service**.
4. Select your **TempChat** repository.
5. Set:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Click **Deploy Web Service**! Render will build the frontend, start the backend, and give you a live `https://tempchat-xxxx.onrender.com` URL with HTTPS and WebSockets working automatically!

### Option B: Railway
1. Go to [railway.app](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub repo** -> Select `TempChat`.
3. Railway automatically detects `npm run build` and `npm start`.
4. Generate a public domain under Settings -> Networking.

---

## Core Technologies
- **Frontend**: React 19, Vite, TailwindCSS v4, Lucide Icons, Emoji Picker React
- **Backend**: Node.js, Express 5, Socket.io
- **Database**: SQLite3 (automatic file-based storage in `backend/data/tempchat.db` with auto-expiration cleanup)
