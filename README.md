# Chatty - Real-Time Chat Application

Chatty is a MERN stack chat application with JWT authentication, Socket.io-powered realtime messaging, and a responsive React UI. The frontend is designed for Vercel deployment, while the backend is designed for Railway deployment with persistent Socket.io connections.

## Overview

The application is split into two deployable parts:

- Frontend: React + Vite + TailwindCSS + DaisyUI, deployed on Vercel
- Backend: Node.js + Express + MongoDB + Socket.io, deployed on Railway

The frontend communicates with the backend over HTTP for auth and data fetching, and over Socket.io for realtime updates such as new messages, typing indicators, and online status.

## Features

- JWT-based auth with HTTP-only cookies
- Realtime one-to-one messaging with Socket.io
- Online user tracking
- Typing and stop-typing indicators
- Responsive chat layout for desktop and mobile
- Sidebar with current-user card, search, conversation list, and logout
- Backend profile picture assignment at user creation
- Gender-aware anime avatar generation for user profiles
- Protected routes for users, messages, and auth state

## Tech Stack

### Frontend

- React 18
- Vite
- React Router DOM
- Zustand for conversation state
- Socket.io client
- TailwindCSS
- DaisyUI
- React Hot Toast
- React Icons

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Socket.io server
- JWT
- bcryptjs
- cookie-parser
- cors
- dotenv

## How the App Works

### Authentication flow

1. A user signs up or logs in from the frontend.
2. The backend validates credentials and sets an HTTP-only JWT cookie.
3. The frontend stores the returned user object in localStorage as `chat-user`.
4. `AuthContext` restores that user on page refresh.
5. Protected API routes use `protectRoute` to verify the cookie and attach `req.user`.

### Messaging flow

1. The user selects a conversation from the sidebar.
2. The frontend loads the conversation messages through `GET /api/messages/:id`.
3. When the user sends a message, the frontend posts to `POST /api/messages/send/:id`.
4. The backend stores the message in MongoDB and emits a Socket.io `newMessage` event to the receiver.
5. The receiving client appends the message in realtime and plays the notification sound.

### Presence and typing flow

1. On login, the frontend creates a Socket.io client connection and sends the logged-in user id in the handshake query.
2. The backend stores the socket id in memory and broadcasts the current online user ids.
3. Typing events are emitted to the target user with `typing` and `stopTyping` events.
4. The UI shows a typing label in the message header when the selected conversation partner is typing.

## Realtime Socket.io Events

### Client to server

- `typing`
- `stopTyping`

### Server to client

- `getOnlineUsers`
- `typing`
- `stopTyping`
- `newMessage`

## Project Structure

```text
Chatty/
├── package.json
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── vercel.json
│   ├── Procfile
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── utils/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── vercel.json
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        ├── utils/
        └── zustand/
```

## Backend Architecture

### Entry point

`backend/server.js` initializes Express, sets up CORS, mounts routes, and starts the HTTP server exported from `backend/socket/socket.js`.

### Socket server

`backend/socket/socket.js` creates the HTTP server and Socket.io instance, keeps an in-memory `userSocketMap`, and handles:

- user connection
- user disconnection
- online user broadcast
- typing relay
- stop-typing relay

### API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/users`
- `GET /api/messages/:id`
- `POST /api/messages/send/:id`

### Models

#### User

Current user fields stored in MongoDB:

- `fullName`
- `username`
- `password`
- `gender`
- `profilePic`
- timestamps

#### Conversation

Conversation documents store:

- `participants`
- `messages`

#### Message

Message documents store:

- `senderId`
- `receiverId`
- `message`
- timestamps

## Frontend Architecture

### Contexts

- `AuthContext` stores the authenticated user in memory and restores it from localStorage.
- `SocketContext` creates the Socket.io client connection and exposes `socket` and `onlineUsers`.

### State management

- `useConversation` keeps the selected conversation and message list in Zustand.
- Conversation selection controls what is rendered in the message panel.
- Messages are loaded when a conversation changes and appended when `newMessage` arrives.

### Hooks

- `useSignup`, `useLogin`, and `useLogout` manage auth requests.
- `useGetConversations` loads the sidebar user list.
- `useGetMessages` loads messages for the selected conversation.
- `useSendMessage` sends new messages and updates local state.
- `useListenMessages` subscribes to Socket.io `newMessage` events.

### Responsive UI behavior

- On desktop, the chat shell is centered and constrained to a smaller max width.
- On mobile, the sidebar and chat panel switch between views instead of forcing both into one column.
- The current logged-in user is shown in the sidebar.
- User avatars are rendered from saved profile images, not random emoji badges.

## Realtime Avatar Generation

When a user signs up, the backend assigns a gender-aware anime avatar URL and saves it in MongoDB as `profilePic`.

Avatar generation rules:

- male users get a male anime avatar endpoint
- female users get a female anime avatar endpoint
- the username is used as a seed so avatars stay unique per account
- missing avatars are backfilled on login or sidebar fetch for older users

This means the avatar is not generated in the browser; it is part of the user data stored in the database.

## Deployment

### Frontend on Vercel

The frontend has a `frontend/vercel.json` file for SPA routing.

Required frontend environment variables on Vercel:

- `VITE_API_BASE_URL` or `VITE_BACKEND_URL`
- `VITE_SOCKET_URL` if the socket URL is different from the API base URL

Example:

```env
VITE_API_BASE_URL=https://your-railway-backend.up.railway.app
VITE_SOCKET_URL=https://your-railway-backend.up.railway.app
```

### Backend on Railway

The backend includes a `backend/Procfile` with `web: npm start`.

Required Railway environment variables:

- `MONGO_DB_URL`
- `NODE_ENV=production`
- `CLIENT_URL` or `FRONTEND_URL` pointing to the deployed Vercel frontend
- `PORT` is assigned by Railway automatically

Example:

```env
MONGO_DB_URL=mongodb+srv://...
NODE_ENV=production
CLIENT_URL=https://your-vercel-app.vercel.app
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Deployment notes

- The backend uses CORS with credentials enabled.
- JWT cookies are configured for cross-site production use.
- Socket.io is configured to allow the deployed frontend origin.
- Because the backend is stateful for connected sockets, it should run as a normal Node service, not a serverless function.

## Local Development

### Prerequisites

- Node.js 14+
- npm
- MongoDB connection string

### Install dependencies

```bash
npm run install-all
```

### Start development servers

```bash
npm run dev
```

This runs the frontend and backend together using `concurrently`.

### Frontend only

```bash
cd frontend
npm run dev
```

### Backend only

```bash
cd backend
npm run dev
```

## Environment Variables

### Backend `.env`

```env
MONGO_DB_URL=your-mongodb-connection-string
NODE_ENV=development
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Notes for Production

- The frontend talks to Railway through the deployed backend URL.
- Socket connections should point to the same Railway backend host.
- Auth relies on cookies, so the frontend origin must be allowed in backend CORS.
- Realtime presence is based on the in-memory socket map, so it resets when the backend restarts.

## Validation

The frontend production build passes after the current changes.

```bash
npm run build --prefix frontend
```

## Summary

Chatty is a full-stack realtime chat application with:

- MongoDB for persistence
- Express and Socket.io on Railway
- React and Vite on Vercel
- JWT auth through HTTP-only cookies
- realtime messaging, typing indicators, and presence updates
- gender-aware anime profile pictures stored in the database
