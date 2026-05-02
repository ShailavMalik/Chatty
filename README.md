# Chatty - Real-Time Chat Application

**🚀 Live Demo:** https://chatty-major.vercel.app  
**🔧 Backend API:** https://chatty-major.up.railway.app

Chatty is a full-featured MERN stack chat application with JWT authentication, Socket.io-powered realtime messaging, progressive web app (PWA) capabilities, and a responsive React UI. The frontend is optimized for Vercel deployment, while the backend is designed for Railway deployment with persistent Socket.io connections.

## Overview

The application is split into two deployable parts:

- **Frontend:** React + Vite + TailwindCSS + DaisyUI, deployed on Vercel
- **Backend:** Node.js + Express + MongoDB + Socket.io, deployed on Railway

The frontend communicates with the backend over HTTP for auth and data fetching, and over Socket.io for realtime updates such as new messages, typing indicators, delivery/read receipts, and online status.

## Features

### Core Messaging

- **JWT-based authentication** with HTTP-only cookies for enhanced security
- **Realtime one-to-one messaging** powered by Socket.io with instant message delivery
- **Online user tracking** with live status indicators showing who is currently online
- **Message delivery & read receipts** with WhatsApp-style single and double checkmarks (real-time updates)
- **Protected routes** for users, messages, and auth state with middleware verification
- **Persistent conversation history** stored in MongoDB with all messages and delivery status

### User Experience

- **High-contrast typing indicators** with animated dots visible in both the chat header and sidebar conversation items
- **Typing status in sidebar** — When someone is typing, their conversation item shows "typing" with animated dots (visible even if the chat is not open)
- **Notification sounds** that play automatically even when the chat is not active (0.8 volume with error handling)
- **Unread message badges** — Blue circular badges on conversation list items showing the count of unread messages
- **Responsive chat layout** for desktop (two-column sidebar + chat) and mobile (switch between views)
- **User profile cards** in the sidebar with avatar, full name, username, and logout button
- **User avatars** with colorful gradient backgrounds and initials of the user's name prominently displayed in the center
- **Smooth message animations** and status transitions with shake effect for new messages from the active conversation
- **Message delivery & read status** with WhatsApp-style single and double checkmarks that update in real-time without page refresh
- **Online status indicators** — Green dot on avatars shows if the user is currently online
- **Message timestamp extraction** — Readable time format for each message (e.g., "2:30 PM", "Yesterday")

### Notifications & Installability

- **Browser notification permission card** in the sidebar with a single click "Enable" button (hides when enabled)
- **Browser notifications** for new messages from inactive conversations (with sender name and message preview)
- **Progressive Web App (PWA)** support for installation on mobile devices without app stores
- **Service worker** with offline-friendly app shell caching (caches HTML, CSS, JS, and icons)
- **Standalone app mode** — Works as a standalone app on iOS and Android with custom icon and theme colors
- **Native system notifications** on supported platforms with customizable badge and icon
- **App installation banner** appears automatically on mobile browsers (Chrome, Edge, Safari)
- **Automatic notification sound** plays for incoming messages without requiring user interaction

### Notifications Architecture

- **Global message listener** mounted at the app level (in the Home component) — ensures notifications work whether the chat is open or closed
- **Unread count tracking** — Increments automatically when messages arrive for inactive conversations and stored in Zustand
- **Multi-channel notification system** — Combines notification sounds, browser notifications, and unread message badges
- **Real-time sound playback** — Notification audio (MP3) plays automatically with volume control and error handling
- **Browser Notification API** with fallback to service worker for better cross-browser compatibility
- **Notification badge clearing** — Automatically clears when a conversation is opened or messages are viewed
- **Service worker integration** — Handles notification clicks and returns user to the app at the root path

## User Avatar System

### Avatar Generation

Each user receives a unique avatar with:

- **Colorful gradient background** — A unique linear gradient generated from the user's ID (ensures each user has a distinct color combination)
- **User initials in the center** — The first letter of the first name and first letter of the last name displayed in large, bold white text
- **Circular design** — Avatar displays in a circle with a subtle ring indicator for online status
- **Fallback for errors** — If a custom image fails to load, the initials avatar is automatically used as a fallback
- **Consistent generation** — Same avatar is always shown for the same user across all UI elements

### How It Works

1. When a user signs up, a colorful initials-based avatar is generated client-side as an SVG data URI with the user's name initials
2. The avatar is stored in the database as `profilePic` for consistency across sessions
3. The same avatar is fetched and displayed across all UI elements (sidebar, chat header, message bubbles)
4. Online status is indicated with a green dot indicator overlay on the avatar
5. If the stored avatar fails to load, the fallback initials avatar is automatically displayed

## Message Delivery & Read Receipts

Messages use a two-stage delivery system similar to WhatsApp:

1. **Single checkmark (✓)** — Message delivered to recipient's device
   - Sent immediately when recipient receives the message over Socket.io
   - Color: Gray (text-slate-200)
   - Indicates message reached the server and was transmitted to recipient

2. **Double checkmark (✓✓)** — Message read/seen by recipient
   - Sent when the recipient opens the conversation and marks messages as seen
   - Color: Emerald green (text-emerald-200)
   - Updates in real-time without requiring a page refresh
   - Stored in the database with a `seenAt` timestamp
   - Indicates the recipient has opened the chat and viewed the message

3. **No checkmark** — Message pending delivery
   - Message still being processed or not yet sent
   - Color: Gray with lighter opacity
   - Indicates the message is waiting to be transmitted

All receipt status changes are reflected immediately in the UI through Socket.io events (`messageDelivered` and `messagesSeen`).

## Tech Stack

### Frontend

- **React 18** — UI library with hooks for state management
- **Vite** — Lightning-fast build tool with HMR (Hot Module Replacement)
- **React Router DOM** — Client-side routing for navigation
- **Zustand** — Lightweight state management for conversation, messages, and unread counts
- **Socket.io client** — Realtime bidirectional communication
- **TailwindCSS** — Utility-first CSS framework for rapid UI development
- **DaisyUI** — Pre-built accessible component library on top of Tailwind
- **React Icons** — Icon library with popular icon sets
- **Vite PWA Plugin** — Progressive Web App support with manifest and service worker

### Backend

- **Node.js** — JavaScript runtime for server-side development
- **Express** — Lightweight HTTP server framework
- **MongoDB with Mongoose** — Document-based NoSQL database with schema validation
- **Socket.io server** — Realtime event-driven communication
- **JWT (jsonwebtoken)** — Secure token-based authentication
- **bcryptjs** — Password hashing with salt rounds
- **cookie-parser** — Middleware for parsing cookies
- **cors** — Cross-Origin Resource Sharing middleware
- **dotenv** — Environment variable management

## How the App Works

### Authentication Flow

1. A user signs up or logs in from the frontend.
2. The backend validates credentials against MongoDB and bcrypt-hashed passwords.
3. The backend generates a JWT token and sets it as an HTTP-only cookie (secure, sameSite, httpOnly flags).
4. The frontend stores the returned user object in localStorage as `chat-user` for persistence.
5. `AuthContext` restores that user on page refresh from localStorage.
6. Protected API routes use `protectRoute` middleware to verify the cookie and attach `req.user` to the request.
7. All subsequent requests automatically send the JWT cookie with credentials enabled.

### Messaging Flow

1. The user selects a conversation from the sidebar (triggering `setSelectedConversation`).
2. The frontend loads the conversation messages through `GET /api/messages/:id` (also marks unread as seen).
3. When the user sends a message, the frontend posts to `POST /api/messages/send/:id` with the message text.
4. The backend stores the message in MongoDB with senderId, receiverId, message text, and timestamps.
5. The backend emits a Socket.io `newMessage` event to the receiver's socket connection.
6. The receiving client appends the message in realtime, triggers the notification sound, and shows browser notification if inactive.
7. When the receiver receives the message, the sender receives a `messageDelivered` event with the deliveredAt timestamp.
8. When the receiver opens the conversation, unread messages are marked as seen and a `messagesSeen` event is sent to the sender.
9. The sender's message UI updates in real-time to show double green checkmarks without requiring refresh.

### Presence and Typing Flow

1. On login, the frontend creates a Socket.io client connection and sends the logged-in user id in the handshake query.
2. The backend stores the socket id in an in-memory map and broadcasts the current online user ids via `getOnlineUsers`.
3. When the user types in the message input, a `typing` event is emitted to the conversation partner.
4. When the user stops typing or sends a message, a `stopTyping` event is emitted.
5. **In the open chat:** The UI shows a typing indicator label in the message header (e.g., "Tanya Singh is typing") with animated emerald dots when the selected conversation partner is typing.
6. **In the sidebar:** Typing indicators appear in the conversation list — when someone is typing, their conversation item shows "typing" with animated dots, allowing users to see typing activity without opening the chat.
7. Typing indicators auto-hide after 1.5 seconds of inactivity (handled by timeout in MessageContainer).

### Unread Messages Flow

1. When a message arrives for an inactive conversation (selected conversation is different from sender), the unread count increments in Zustand.
2. The Conversation component displays the unread badge with the count.
3. When the user clicks on the conversation, the unread count is cleared before selecting the conversation.
4. When `GET /api/messages/:id` is called, unread messages are marked as seen on the backend.
5. The `messagesSeen` event updates the sender's message UI with green double checkmarks.

## Realtime Socket.io Events

### Client to Server

- **`typing`** — Sent when the user starts typing a message (emitted on first keystroke after delay or stopTyping)
- **`stopTyping`** — Sent when the user stops typing or sends a message (clears timeout and emits immediately)

### Server to Client

- **`getOnlineUsers`** — Broadcast of all currently connected user IDs (sent on user connection and after any connection change)
- **`typing`** — Notification that the conversation partner is typing (includes senderId)
- **`stopTyping`** — Notification that the conversation partner stopped typing (includes senderId)
- **`newMessage`** — Incoming message from another user with senderId, receiverId, message text, and createdAt timestamp
- **`messageDelivered`** — Confirmation that a message reached the recipient's device (includes messageId and deliveredAt)
- **`messagesSeen`** — Notification that messages were read by the recipient (includes messageIds array and seenAt timestamp)

## Deployment

### Live Deployment Status

**Frontend:** https://chatty-major.vercel.app (Vercel)  
**Backend:** https://chatty-major.up.railway.app (Railway)

### Backend (Railway)

1. Create a Railway project and connect your GitHub repo
2. Set environment variables in Railway:
   - `MONGO_DB_URI` — MongoDB connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/chatty`)
   - `JWT_SECRET` — Secret for JWT signing (use a strong random string)
   - `PORT` — Port number (default 5000, assigned by Railway)
   - `CLIENT_URL`, `FRONTEND_URL`, or `CORS_ORIGIN` — Frontend URL for CORS (e.g., `https://chatty-major.vercel.app`)
   - `NODE_ENV` — Set to `production` for production deployment
3. Railway will auto-detect the Node.js project and run `npm start` which executes `node backend/server.js`
4. The `Procfile` in the backend directory tells Railway how to start the server

### Frontend (Vercel)

1. Create a Vercel project and connect your GitHub repo
2. Set environment variables in Vercel:
   - `VITE_API_BASE_URL` — Backend API base URL (e.g., `https://chatty-major.up.railway.app`)
   - `VITE_SOCKET_URL` — Socket.io server URL (e.g., `https://chatty-major.up.railway.app`)
3. Configure build settings:
   - Build command: `npm install && npm install --prefix frontend && npm run build --prefix frontend`
   - Output directory: `frontend/dist`
   - Root directory: `/` (monorepo root)
4. Vercel automatically serves the SPA from `frontend/dist` and rewrites all routes to `index.html` (via `vercel.json`)

## Environment Variables

### Backend (.env)

```bash
# Database
MONGO_DB_URI=mongodb+srv://user:password@cluster.mongodb.net/chatty

# Security
JWT_SECRET=your-very-secret-key-here-min-32-chars

# Server
PORT=5000
NODE_ENV=production

# CORS - Frontend URL
CLIENT_URL=https://chatty-major.vercel.app
FRONTEND_URL=https://chatty-major.vercel.app
CORS_ORIGIN=https://chatty-major.vercel.app
```

### Frontend (.env.local for local dev or Vercel env vars for production)

```bash
# Backend API URL
VITE_API_BASE_URL=https://chatty-major.up.railway.app
VITE_SOCKET_URL=https://chatty-major.up.railway.app
```

### Environment Variable Fallback Chain (Frontend)

The frontend looks for the backend URL in this order:

1. `VITE_API_BASE_URL` (recommended)
2. `VITE_BACKEND_URL`
3. `VITE_SERVER_URL`
4. Empty string (uses relative paths for same-origin requests)

This flexibility allows the app to work in development, testing, and various production deployments without code changes.

## Running Locally

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB running locally or a MongoDB Atlas connection string

### Setup

```bash
# Install all dependencies (root + frontend + backend)
npm install

# Install frontend dependencies
npm install --prefix frontend

# Install backend dependencies
npm install --prefix backend

# Create .env file in backend directory with MongoDB and JWT secret
echo "MONGO_DB_URI=mongodb://localhost:27017/chatty" > backend/.env
echo "JWT_SECRET=your-local-secret-key" >> backend/.env
echo "NODE_ENV=development" >> backend/.env
```

### Development

```bash
# Run frontend and backend concurrently
npm run dev
```

This starts:

- **Frontend** on `http://localhost:5173` (Vite dev server with HMR)
- **Backend** on `http://localhost:5000` (Express + Socket.io)

### Production Build

```bash
# Build the frontend
npm run build --prefix frontend

# Backend is ready as-is (Node requires no build step)
```

This builds the frontend to `frontend/dist` and prepares the backend for deployment via Railway.

## Installation as Mobile App

### On Chrome/Edge (Android)

1. Open Chatty in your browser at https://chatty-major.vercel.app
2. Tap the menu (three dots) → "Install app" or look for the install banner at the bottom
3. The app installs to your home screen and runs standalone (no browser UI)
4. Use like any native app with offline support via Service Worker

### On Safari (iOS)

1. Open Chatty in Safari at https://chatty-major.vercel.app
2. Tap Share → "Add to Home Screen"
3. The app installs and runs as a web app (with limited offline support in iOS)
4. Use like any native app with custom splash screen and theme colors

### What Gets Installed

The app includes:

- **Offline-friendly app shell caching** via Service Worker (caches HTML, CSS, JS, icons, manifest)
- **Custom app icon** (pwa-icon.svg) for home screen display
- **Splash screen** with app name and theme colors
- **Standalone fullscreen mode** (no browser UI, just the app)
- **Native-like experience** with theme colors matching the app design
- **Responsive design** that adapts to mobile device screens

## Project Structure

```
Chatty/
├── package.json                    # Root package with dev dependencies and scripts
├── README.md                       # This file
├── backend/
│   ├── package.json
│   ├── server.js                  # Express server with Socket.io setup
│   ├── vercel.json                # Vercel deployment config
│   ├── Procfile                   # Procfile for Railway (web: npm start)
│   ├── controllers/
│   │   ├── auth.controller.js     # Login, signup, logout endpoints
│   │   ├── message.controller.js  # Send and fetch messages with delivery status
│   │   └── user.controller.js     # Get users for sidebar list
│   ├── models/
│   │   ├── user.model.js          # User schema with profilePic
│   │   ├── message.model.js       # Message schema with deliveredAt/seenAt
│   │   └── conversation.model.js  # Conversation schema with participants and messages
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── message.routes.js
│   │   └── user.routes.js
│   ├── middleware/
│   │   └── protectRoute.js        # JWT verification middleware
│   ├── db/
│   │   └── connectToMongoDB.js
│   ├── socket/
│   │   └── socket.js              # Socket.io server setup and event handlers
│   └── utils/
│       ├── buildAnimeProfilePic.js # Avatar generation utility (now generates initials)
│       └── generateToken.js        # JWT signing utility
│
├── frontend/
│   ├── package.json
│   ├── index.html                 # PWA manifest link and meta tags
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json                # Vercel SPA rewrite config
│   ├── public/
│   │   ├── favicon.png
│   │   ├── bg.jpg                 # Background image
│   │   ├── manifest.webmanifest   # PWA manifest with app config
│   │   ├── sw.js                  # Service Worker for offline support
│   │   └── pwa-icon.svg           # App icon (512x512)
│   └── src/
│       ├── main.jsx               # App entry point, Service Worker registration
│       ├── App.jsx                # Router setup and auth validation
│       ├── index.css              # Global styles (including typing animation keyframes)
│       ├── App.css
│       ├── context/
│       │   ├── AuthContext.jsx    # Auth state and user info with localStorage persistence
│       │   └── SocketContext.jsx  # Socket.io client and online users state
│       ├── pages/
│       │   ├── home/
│       │   │   └── Home.jsx       # Main chat layout with global message listener
│       │   ├── login/
│       │   │   └── Login.jsx
│       │   └── signup/
│       │       ├── SignUp.jsx
│       │       └── GenderCheckbox.jsx
│       ├── components/
│       │   ├── messages/
│       │   │   ├── MessageContainer.jsx    # Chat header + typing indicator display
│       │   │   ├── Messages.jsx            # Message list with scroll to bottom
│       │   │   ├── Message.jsx             # Individual message with delivery/read ticks
│       │   │   └── MessageInput.jsx        # Input field with typing event emission
│       │   ├── sidebar/
│       │   │   ├── Sidebar.jsx             # User profile card + notification permission UI
│       │   │   ├── Conversations.jsx       # Conversation list wrapper
│       │   │   ├── Conversation.jsx        # Single conversation item with typing & badge
│       │   │   ├── SearchInput.jsx
│       │   │   └── LogoutButton.jsx
│       │   └── skeletons/
│       │       └── MessageSkeleton.jsx
│       ├── hooks/
│       │   ├── useLogin.js
│       │   ├── useSignup.js
│       │   ├── useLogout.js
│       │   ├── useSendMessage.js
│       │   ├── useGetConversations.js
│       │   ├── useGetMessages.js        # Fetches messages and marks seen
│       │   ├── useListenMessages.js     # Global listener with notifications & delivery tracking
│       │   └── useListenMessages.js     # (Note: duplicate entry, consolidate)
│       ├── zustand/
│       │   └── useConversation.js   # Central state: conversation, messages, unread counts, typing
│       └── utils/
│           ├── runtimeConfig.js     # API URL builder with fallback chain
│           ├── extractTime.js
│           ├── emojis.js
│           └── buildAvatarDataUri.js
```

## API Endpoints

### Authentication

- **`POST /api/auth/signup`** — Register a new user with username, password, and gender
  - Request: `{ fullName, username, password, passwordConfirm, gender }`
  - Response: `{ _id, fullName, username, profilePic }`
  - Sets JWT cookie automatically

- **`POST /api/auth/login`** — Login with username and password
  - Request: `{ username, password }`
  - Response: `{ _id, fullName, username, profilePic }`
  - Sets JWT cookie automatically

- **`POST /api/auth/logout`** — Logout (clears JWT cookie)
  - Request: (no body)
  - Response: `{ message: "Logged out successfully" }`

### Users

- **`GET /api/users`** — Get all users except the current user (for sidebar)
  - Protected route (requires JWT cookie)
  - Response: `[{ _id, fullName, username, profilePic }, ...]`

### Messages

- **`GET /api/messages/:id`** — Get all messages in conversation with user ID
  - Protected route
  - Automatically marks unread messages as seen
  - Response: `[{ _id, senderId, receiverId, message, createdAt, deliveredAt, seenAt }, ...]`

- **`POST /api/messages/send/:id`** — Send a message to user ID
  - Protected route
  - Request: `{ message: "text" }`
  - Response: `{ _id, senderId, receiverId, message, createdAt, deliveredAt, seenAt }`
  - Emits `newMessage` event via Socket.io to recipient

## Notification Features

### Browser Notifications

1. User sees "Notifications" card in sidebar when permission is not yet granted
2. User clicks "Enable" button to request Notification API permission
3. Browser shows permission prompt (user approves or denies)
4. When a message arrives for an inactive conversation:
   - Notification sound plays automatically (0.8 volume)
   - Unread badge increments on the conversation item (blue circle with count)
   - Browser notification is shown with sender's name and message preview (if permission granted)
5. Clicking the notification opens the app and navigates to the chat
6. Opening the conversation clears the unread badge automatically
7. After enabled, the notification card disappears from the sidebar

### Service Worker Features

- **App shell caching** — Caches HTML, CSS, JS, icons, and manifest for instant loads on revisit
- **Offline navigation** — Handles offline requests gracefully (falls back to cache)
- **Notification handling** — Responds to notification clicks and opens the app
- **Web Push integration** — Ready for backend Web Push API integration (future enhancement)

## Common Issues & Troubleshooting

### Backend returns 405 Method Not Allowed

**Cause:** Frontend is hitting the wrong deployment (frontend instead of backend) due to missing or incorrect environment variables.

**Fix:**
- Ensure `VITE_API_BASE_URL` or `VITE_SOCKET_URL` environment variable is set to your backend URL (e.g., `https://chatty-major.up.railway.app`)
- For live app at https://chatty-major.vercel.app, verify `VITE_API_BASE_URL=https://chatty-major.up.railway.app` in Vercel settings
- Check CORS headers are correct on the backend (should match frontend origin)
- Clear browser cache and restart the dev server
- Verify Railway backend is running and accessible at the specified URL

### Typing indicator not visible

**Fixed:** The typing indicator now uses high-contrast emerald styling to be visible on the message panel background. It appears in both:
- **In open chat:** Message header shows "Name is typing" with animated dots
- **In sidebar:** Conversation item shows "typing" with animated dots (even if chat is not open)

**If not working:**
- Ensure sender has started typing (press any key in message input)
- Check Socket.io connection is active (Network tab → WebSocket)
- Verify chat is not currently open (sidebar typing only shows for inactive conversations)

### Green ticks appear only after refresh

**Fixed:** The `messagesSeen` Socket.io event now properly updates message status in real-time. Green double checkmarks appear immediately when the receiver opens a conversation without requiring a page refresh.

**Technical details:** Fixed by properly normalizing messageIds when comparing sent and received messages (converting both to strings before comparison).

### Messages not delivering

**Check:**
- Backend MongoDB connection is healthy (verify MONGO_DB_URI in Railway)
- Socket.io connection is established (DevTools → Network → WS)
- Backend and frontend have correct CORS origins configured
- Message receiver is logged in and connected (online status visible)
- Both users are on the same backend instance (no load balancing without sticky sessions)
- Message text is not empty
- Receiver socket ID exists in the in-memory map on backend

### Notifications not showing

**Check:**
- User has granted notification permission in the sidebar (permission card should disappear after enabling)
- The receiver has not muted browser notifications in OS settings (Mac: System Preferences → Notifications → Chrome)
- Service Worker is registered (DevTools → Application → Service Workers → should show `/sw.js`)
- Browser supports Notification API (all modern browsers do; check `Notification` object exists)
- Notification sound volume is not muted (check browser/OS volume settings)
- For background notifications: Service Worker must be active and registered with notification permissions

### Typing indicators not showing in sidebar

**Check:**
- The sender has started typing (press any key in the message input)
- Typing timeout hasn't expired (indicators auto-hide after 1.5 seconds of inactivity)
- The chat is not currently open (sidebar typing is only visible for inactive conversations)
- Socket.io connection is active (check Network tab)
- `typingConversationId` is being set correctly in Zustand store

### App not installable on mobile

**Check:**
- PWA manifest is served at `/manifest.webmanifest` (verify at https://chatty-major.vercel.app/manifest.webmanifest)
- Service Worker is registered successfully (DevTools → Application → Service Workers)
- `https://` is used in production (PWAs require HTTPS; `http://localhost` is exception)
- Install banner appears automatically on first visit (or use browser menu → Install)
- For iOS: Use Safari browser (Chrome on iOS has limitations)
- Try clearing app data and revisiting with a fresh session

### Unread badge not clearing

**Check:**
- Click on the conversation to select it (badge should clear automatically)
- Messages are marked as seen when conversation loads via `GET /api/messages/:id`
- Badge state is stored in Zustand and updates immediately without refresh
- If stuck, try logging out and back in to reset all state

### Socket.io connection failing

**Check:**
- Backend is running and accessible at the provided URL
- Firewall or proxy is not blocking WebSocket connections
- `CORS_ORIGIN` in backend matches frontend URL exactly
- Socket.io versions match (frontend and backend)
- Try hard refresh (Ctrl+Shift+R) to clear old socket connections

## Future Enhancements

- [ ] **Web Push Notifications** — Send notifications even when browser is closed (backend subscription management)
- [ ] **Message search and filtering** — Search through conversation history with full-text search
- [ ] **Group conversations** — Support for multi-person chats with group management
- [ ] **Image/file sharing** — Upload and share files, images, and media in messages
- [ ] **Message reactions** — Add emoji reactions to messages (like WhatsApp, Slack)
- [ ] **Message replies** — Quote and reply to specific messages in conversations
- [ ] **User profile editing** — Allow users to change name, upload custom avatars, update bio
- [ ] **Block/mute users** — Prevent messages from specific users or mute notifications
- [ ] **End-to-end encryption** — Secure messaging with E2E encryption (E2EE)
- [ ] **Dark mode toggle** — Theme switcher for dark and light mode preferences
- [ ] **Voice/video calls** — Realtime audio and video communication via WebRTC
- [ ] **Message pinning** — Pin important messages in conversations for quick reference
- [ ] **User status** — Custom status messages (online, away, busy, offline, dnd)
- [ ] **Typing timeout optimization** — Reduce typing event spam with debouncing
- [ ] **Message pagination** — Load older messages on scroll (infinite scroll)
- [ ] **Read receipts** — Enhanced delivery status with delivery time
- [ ] **Message reactions** — Emoji reactions on messages
- [ ] **User presence** — Show "last seen at" timestamp

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test them
4. Test locally (`npm run dev`)
5. Build for production (`npm run build`)
6. Commit with clear messages (`git commit -m 'Add amazing feature'`)
7. Push to your fork and submit a pull request

### Development Guidelines

- Follow the existing code structure and naming conventions
- Use functional components with React hooks (no class components)
- Keep components focused and reusable
- Add comments for complex logic or non-obvious decisions
- Test changes in both development and production builds
- Ensure Socket.io events are properly cleaned up (off listeners in useEffect cleanup)
- Follow TailwindCSS utility-first approach for styling
- Keep state management simple with Zustand (avoid over-nesting)

## License

ISC

---

## Quick Links

- **Live App:** https://chatty-major.vercel.app
- **Backend API:** https://chatty-major.up.railway.app
- **GitHub:** (Add your repo link)
- **Issues:** (Add issues link)

---

**Chatty** is a full-stack realtime chat application demonstrating modern web development practices with:

- MongoDB for persistent data storage
- Express and Socket.io on Railway for backend
- React and Vite on Vercel for frontend
- JWT authentication with HTTP-only cookies
- Realtime messaging, typing indicators, and presence updates
- Colorful initials-based profile avatars
- PWA capabilities for mobile installation
- Comprehensive notification system (sounds, badges, browser notifications)
