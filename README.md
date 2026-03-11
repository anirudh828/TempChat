# TempChat - Secure Temporary Chat Rooms

TempChat is a modern, real-time web application where users can create password-protected chat rooms that automatically expire after a set time. Built with React, TailwindCSS, Express, Node.js, Socket.io, and a local SQLite database file.

## Features

- **Real-time Messaging**: Instant, low-latency communication via Socket.io.
- **Temporary Rooms**: Rooms expire automatically after a specified time frame (e.g., 5 mins to 24 hours).
- **Password Protection**: Secure your rooms with passwords.
- **Message Reactions**: React to specific messages with emojis (👍 ❤️ 😂 🔥 🎉).
- **Typing Indicators**: See when others are typing in real-time.
- **Activity Dashboard**: View room stats, creator name, active user count, and time remaining.
- **Dark / Light Mode**: Seamlessly toggle between dark and light themes (preference saved).
- **Responsive Design**: Looks beautiful on mobile, tablet, and desktop securely built with TailwindCSS.

---

## Folder Structure

```
tempchat/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # API logic
│   ├── models/          # Mongoose schemas (Room, Message)
│   ├── routes/          # Express route definitions
│   ├── socket/          # Socket.io event handlers
│   ├── .env             # Environment variables
│   └── server.js        # Main entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI parts (ChatBox, Message, etc.)
    │   ├── pages/       # Route-level components (Home, ChatRoom)
    │   ├── App.jsx      # React router & theme logic
    │   └── index.css    # Tailwind directives & global styles
    ├── .env             # Frontend env variables
    ├── index.html       # Vite entry HTML
    └── tailwind.config.js
```

---

## Prerequisites

- **Node.js**: Verify installation (`node -v`)
- **Database**: Uses SQLite built-in (no external setup required!)

---

## Setup & Running Locally

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file (already created during generation) in the `backend` folder:
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   # Database will automatically generate as tempchat.db
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup

1. Open a *new* terminal block and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your frontend `.env` (already created if you used Vite defaults or create one):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`.

---

## Deployment Guidelines

### Backend (Render or Railway)
- Create a new Web Service pointing to the `/backend` folder.
- Add your environment variables: `MONGO_URI`, `FRONTEND_URL` (the deployed Vercel URL), and `PORT`.
- Start Command: `node server.js`

### Frontend (Vercel)
- Create a new project in Vercel pointing to the `/frontend` folder.
- Framework Preset should be detected as **Vite**.
- Add the Environment Variable: `VITE_API_URL` pointing to your deployed backend URL.
- Deploy!

---

## Core Technologies
- **React** (Vite)
- **TailwindCSS** (Styling + Dark Mode)
- **Lucide React** (Icons)
- **Node.js & Express** 
- **Socket.io** (WebSockets)
- **MongoDB & Mongoose** (Database)
