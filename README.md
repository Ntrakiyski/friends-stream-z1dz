# Friends Stream - Simple Video Messaging MVPз

A lightweight, real-time video messaging web application for a small group of friends (Chris, Nick, and Angel) to share live video messages with each other.

## 🎥 Features

- **Live Video Streaming**: Start a live stream using your front camera
- **Real-time Notifications**: Get notified when friends go live
- **Join Live Streams**: Watch friends' live broadcasts as a viewer
- **Video History**: Browse and watch past recorded videos
- **Simple Authentication**: Hardcoded users (Chris, Nick, Angel)
- **Clean UI**: Minimalist black-and-white design with ShadCN components

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **ShadCN UI** components with Tailwind CSS
- **WebRTC** for peer-to-peer video streaming
- **Socket.IO Client** for real-time signaling

### Backend
- **Node.js** with Express.js
- **Socket.IO** for WebRTC signaling server
- **SQLite** with better-sqlite3 for data persistence

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Application

The application runs both frontend (Vite) and backend (Express) servers concurrently:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: http://localhost:3001 (Express + Socket.IO)

### 3. Open Multiple Browser Windows

To test the video streaming functionality:

1. Open http://localhost:3000 in your browser
2. Select a user (e.g., "Chris")
3. Open http://localhost:3000 in another browser window or incognito
4. Select a different user (e.g., "Nick")
5. Start streaming from one window and join from another

## 📂 Project Structure

```
friends-stream/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── ui/                 # ShadCN base components
│   │   ├── StreamView.tsx      # Streamer interface
│   │   ├── ViewerView.tsx      # Viewer interface
│   │   ├── VideoList.tsx       # Past videos list
│   │   ├── VideoPlayer.tsx     # Video playback component
│   │   └── UserSelector.tsx    # User login screen
│   ├── hooks/                   # Custom React hooks
│   │   ├── useMediaStream.ts   # Camera access management
│   │   ├── useSignaling.ts     # Socket.IO connection
│   │   └── useWebRTC.ts        # WebRTC peer connections
│   ├── contexts/                # React contexts
│   │   └── UserContext.tsx     # User state management
│   ├── lib/                     # Utilities
│   │   └── utils.ts            # Helper functions
│   ├── types/                   # TypeScript types
│   │   └── index.ts            # Type definitions
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles
├── server/                       # Backend Node.js application
│   ├── index.js                 # Express + Socket.IO server
│   ├── db.js                    # SQLite database functions
│   └── videos.db                # SQLite database (created on first run)
├── index.html                    # HTML entry point
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── package.json                 # Dependencies and scripts
```

## 🎮 How to Use

### Starting a Stream

1. Select your name (Chris, Nick, or Angel)
2. Click "Start Stream" button
3. Grant camera and microphone permissions
4. Your video feed will appear
5. Other users will receive a notification

### Joining a Stream

1. When someone starts streaming, you'll see a notification
2. Click "Join Stream" to watch the live broadcast
3. Click "Leave Stream" when done

### Ending a Stream

1. As the streamer, click "Finish Stream"
2. The video will be automatically saved
3. All viewers will be disconnected
4. The video appears in the "Past Videos" section

### Viewing Past Videos

- Scroll down to see the "Past Videos" section
- Each video shows:
  - Video icon
  - Streamer name
  - Date recorded
  - Duration
  - List of viewers who joined

## 🔧 Development Scripts

```bash
# Run both frontend and backend
npm run dev

# Run frontend only
npm run dev:client

# Run backend only
npm run dev:server

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

### WebRTC Flow

1. **Streamer** starts camera → creates local MediaStream
2. **Signaling Server** (Socket.IO) notifies all connected users
3. **Viewer** clicks join → requests to view stream
4. **WebRTC Handshake**:
   - Streamer creates RTCPeerConnection and sends offer
   - Viewer receives offer and sends answer
   - ICE candidates exchanged for NAT traversal
5. **Peer-to-peer** video stream established

### Database Schema

```sql
CREATE TABLE videos (
  id TEXT PRIMARY KEY,           -- Unique stream ID
  streamer_name TEXT NOT NULL,   -- Who recorded it
  timestamp TEXT NOT NULL,       -- When it was recorded
  duration INTEGER NOT NULL,     -- Length in seconds
  viewers TEXT NOT NULL,         -- JSON array of viewer names
  created_at DATETIME            -- Database timestamp
)
```

## 🎨 Customization

### Adding More Users

Edit `src/components/UserSelector.tsx`:

```typescript
const users: User[] = ['Chris', 'Nick', 'Angel', 'NewUser']
```

Also update the type in `src/types/index.ts`:

```typescript
export type User = 'Chris' | 'Nick' | 'Angel' | 'NewUser'
```

### Changing Theme Colors

Edit `src/index.css` to customize the color palette.

### Modifying UI Components

All UI components in `src/components/` can be customized. They use ShadCN patterns with Tailwind CSS utility classes.

## 🐛 Troubleshooting

### Camera Not Working

- Ensure you've granted browser permissions for camera/microphone
- Check if another application is using the camera
- Try using HTTPS (WebRTC requires secure context in production)

### Connection Issues

- Ensure both frontend (3000) and backend (3001) ports are available
- Check browser console for errors
- Verify Socket.IO connection in Network tab

### WebRTC Not Connecting

- WebRTC requires STUN/TURN servers for NAT traversal
- Current setup uses Google's public STUN servers
- For production, consider using a TURN server

## 🚀 Production Deployment

### Build the Frontend

```bash
npm run build
```

This creates a `dist/` folder with optimized static files.

### Deploy Backend

The backend (`server/`) can be deployed to any Node.js hosting service:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

### Environment Variables

For production, set:
- Frontend API URL (in vite.config.ts proxy settings)
- Backend CORS origin
- Database path for SQLite

## 📝 Future Enhancements

- [ ] Video recording and storage (currently metadata only)
- [ ] Push notifications
- [ ] Screen sharing
- [ ] Chat during live streams
- [ ] Video playback controls
- [ ] User avatars
- [ ] Stream thumbnails
- [ ] Mobile responsive improvements

## 🤝 Contributing

This is a simple MVP. Feel free to extend it with additional features!

## 📄 License

Private project for personal use.

---

**Built with ❤️ using React, Vite, WebRTC, and Socket.IO**
