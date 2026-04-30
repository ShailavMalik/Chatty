# Chatty - Real-Time Chat Application

A full-stack real-time messaging application built with the MERN stack, Socket.io, and modern web technologies. Users can create accounts, authenticate securely with JWT, and communicate with other users in real-time.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Key Features Explained](#key-features-explained)

---

## ✨ Features

- 🌟 **Tech Stack**: MERN (MongoDB, Express, React, Node.js) + Socket.io + TailwindCSS + Daisy UI
- 🎃 **Authentication & Authorization**: Secure JWT-based authentication with HTTP-only cookies
- 👾 **Real-Time Messaging**: Instant message delivery using WebSocket (Socket.io)
- 🚀 **Online User Status**: Real-time presence tracking with Socket.io and React Context
- 👌 **Global State Management**: Zustand for efficient client-side state
- 🐞 **Error Handling**: Comprehensive error handling on both frontend and backend
- 🔐 **Route Protection**: Middleware-based protected routes
- 🎨 **Modern UI**: Responsive design with TailwindCSS and Daisy UI components
- ⚡ **Message Timestamps**: Formatted time display for each message

---

## 🛠 Tech Stack

### **Frontend**

- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool and dev server
- **Socket.io Client 4.7.4** - WebSocket communication
- **React Router DOM 6.21.3** - Client-side routing
- **Zustand 4.5.0** - Lightweight state management
- **TailwindCSS 3.4.1** - Utility-first CSS framework
- **Daisy UI 4.6.1** - Component library built on TailwindCSS
- **React Hot Toast 2.4.1** - Toast notifications
- **React Icons 5.0.1** - Icon library
- **PostCSS & Autoprefixer** - CSS processing

### **Backend**

- **Node.js with Express 4.18.2** - Server framework
- **Socket.io 4.7.4** - Real-time bidirectional communication
- **MongoDB 8.1.1 with Mongoose** - NoSQL database
- **JWT (jsonwebtoken 9.0.2)** - Token-based authentication
- **Bcryptjs 2.4.3** - Password hashing
- **Cookie Parser 1.4.6** - Cookie middleware
- **CORS 2.8.5** - Cross-origin resource sharing
- **Dotenv 16.4.5** - Environment variable management
- **Nodemon 3.0.3** - Development hot reload

### **Development Tools**

- **Concurrently 8.2.2** - Run multiple npm scripts simultaneously

---

## 📁 Project Structure

```
chatty/
├── package.json                      # Root package (dev only: concurrently)
├── README.md                         # This file
├── backend/
│   ├── package.json                 # Backend dependencies
│   ├── server.js                    # Express server entry point
│   ├── .env                         # Backend environment variables
│   ├── vercel.json                  # Vercel deployment config
│   ├── controllers/
│   │   ├── auth.controller.js       # Login, signup, logout logic
│   │   ├── message.controller.js    # Message CRUD operations
│   │   └── user.controller.js       # User profile operations
│   ├── db/
│   │   └── connectToMongoDB.js      # MongoDB connection
│   ├── middleware/
│   │   └── protectRoute.js          # JWT authentication middleware
│   ├── models/
│   │   ├── user.model.js            # User schema
│   │   ├── conversation.model.js    # Conversation schema
│   │   └── message.model.js         # Message schema
│   ├── routes/
│   │   ├── auth.routes.js           # /api/auth endpoints
│   │   ├── user.routes.js           # /api/users endpoints
│   │   └── message.routes.js        # /api/messages endpoints
│   ├── socket/
│   │   └── socket.js                # Socket.io event handlers
│   └── utils/
│       └── generateToken.js         # JWT token generation
│
├── frontend/
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # TailwindCSS configuration
│   ├── postcss.config.js            # PostCSS plugins
│   ├── index.html                   # HTML entry point
│   ├── public/                      # Static assets
│   └── src/
│       ├── main.jsx                 # React entry point
│       ├── App.jsx                  # Root component
│       ├── App.css                  # Global styles
│       ├── index.css                # Base styles
│       ├── components/
│       │   ├── messages/
│       │   │   ├── Message.jsx      # Single message display
│       │   │   ├── MessageContainer.jsx  # Messages list
│       │   │   ├── MessageInput.jsx # Input form
│       │   │   └── Messages.jsx     # Messages wrapper
│       │   ├── sidebar/
│       │   │   ├── Conversation.jsx # Single conversation item
│       │   │   ├── Conversations.jsx # Conversations list
│       │   │   ├── SearchInput.jsx  # Search users
│       │   │   ├── LogoutButton.jsx # Logout button
│       │   │   └── Sidebar.jsx      # Sidebar wrapper
│       │   └── skeletons/
│       │       └── MessageSkeleton.jsx # Loading skeleton
│       ├── pages/
│       │   ├── home/
│       │   │   └── Home.jsx         # Main chat page
│       │   ├── login/
│       │   │   └── Login.jsx        # Login page
│       │   └── signup/
│       │       ├── SignUp.jsx       # Signup page
│       │       └── GenderCheckbox.jsx # Gender select
│       ├── context/
│       │   ├── AuthContext.jsx      # Auth state provider
│       │   └── SocketContext.jsx    # Socket.io provider
│       ├── hooks/
│       │   ├── useGetConversations.js
│       │   ├── useGetMessages.js
│       │   ├── useListenMessages.js # Real-time message listener
│       │   ├── useLogin.js
│       │   ├── useLogout.js
│       │   ├── useSendMessage.js
│       │   └── useSignup.js
│       ├── zustand/
│       │   └── useConversation.js   # Global conversation state
│       ├── utils/
│       │   ├── emojis.js           # Emoji data
│       │   └── extractTime.js      # Time formatting utility
│       └── assets/
│           └── sounds/              # Notification sounds
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB account (MongoDB Atlas recommended)

### Step 1: Clone & Navigate

```bash
cd Chatty
```

### Step 2: Install All Dependencies

```bash
npm run install-all
```

This installs dependencies for root, frontend, and backend folders.

### Step 3: Configure Environment Variables

**Backend (.env)**
Create `backend/.env` with:

```env
MONGO_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/chatty
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

**Frontend**
Frontend uses relative API paths (`/api`) proxied through Vite dev server to `http://localhost:5000/api`.

### Step 4: Start Development

```bash
npm run dev
```

This runs **both frontend and backend concurrently**:

- **Frontend**: http://localhost:5173 (Vite)
- **Backend**: http://localhost:5000

---

## 🏃 Running the Application

### Development Mode (Both Frontend & Backend)

```bash
npm run dev
```

### Backend Only

```bash
cd backend && npm run dev
```

### Frontend Only

```bash
cd frontend && npm run dev
```

### Production Build

```bash
npm run build
```

Builds the frontend for production.

---

## 🔌 API Endpoints

All API requests use the base URL: `http://localhost:5000/api`

### Authentication Routes (`/api/auth`)

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### User Routes (`/api/users`)

- `GET /users` - Get all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `PUT /users/:id` - Update user profile (protected)

### Message Routes (`/api/messages`)

- `GET /messages/conversations` - Get all conversations (protected)
- `GET /messages/:conversationId` - Get messages in a conversation (protected)
- `POST /messages/send/:conversationId` - Send message (protected)

---

## 🔄 WebSocket Events

### Client → Server

- `message:send` - User sends a message
- `user:typing` - User is typing indicator
- `user:online` - User comes online

### Server → Client

- `message:new` - New message received
- `user:typing` - Someone is typing
- `user:status` - User online/offline status
- `conversation:updated` - Conversation list changed

---

## 💾 Database Schema

### User Model

```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  gender: String (male/female/other),
  avatar: String (profile picture URL),
  createdAt: Date
}
```

### Conversation Model

```javascript
{
  participants: [ObjectId], // User IDs
  lastMessage: String,
  updatedAt: Date,
  createdAt: Date
}
```

### Message Model

```javascript
{
  sender: ObjectId (User reference),
  conversationId: ObjectId (Conversation reference),
  content: String,
  createdAt: Date
}
```

---

## 🔑 Environment Variables

### Backend `.env`

```env
MONGO_DB_URL          # MongoDB connection string
PORT                  # Server port (default: 5000)
JWT_SECRET            # Secret key for JWT signing
NODE_ENV              # development/production
```

---

## 📖 Key Features Explained

### 1. **Real-Time Messaging**

Uses Socket.io to establish persistent WebSocket connections between client and server. Messages are sent and received instantly without page refresh.

### 2. **JWT Authentication**

- User credentials are exchanged for a JWT token
- Token is stored in HTTP-only cookie (secure)
- Token is verified on protected routes via `protectRoute` middleware

### 3. **Online Status**

Socket.io events track user connection/disconnection. Frontend Context API broadcasts online users to the UI in real-time.

### 4. **State Management**

- **Zustand**: Manages conversation selection and message history
- **React Context**: Handles auth state and Socket.io instance
- **Local Storage**: Persists user data across page refreshes

### 5. **Error Handling**

- Backend returns structured error responses with status codes
- Frontend uses React Hot Toast for user-friendly error messages
- Protected routes prevent unauthorized access

### 6. **Responsive Design**

TailwindCSS + Daisy UI components ensure the app works seamlessly on desktop, tablet, and mobile devices.

---

## 📝 Notes

- Backend runs on `port 5000`
- Frontend development server (Vite) runs on `port 5173`
- Vite proxy at `/api` routes requests to backend
- Socket.io connects to `http://localhost:5000` on localhost
- JWT tokens expire based on backend configuration
- All passwords are hashed with bcryptjs before storage

---
