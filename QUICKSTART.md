# 🚀 Quick Start Guide - Friends Stream

Get up and running in 3 minutes!

## ✅ What's Already Done

The project is fully set up with:
- ✅ React + Vite + TypeScript frontend
- ✅ Express + Socket.IO + SQLite backend  
- ✅ ShadCN UI components with Tailwind CSS
- ✅ WebRTC hooks for video streaming
- ✅ All dependencies installed

## 🎬 How to Run

### Step 1: Start the Application

```bash
npm run dev
```

This starts both:
- **Frontend** at http://localhost:3000
- **Backend** at http://localhost:3001

### Step 2: Test Video Streaming

**Window 1 (Streamer):**
1. Open http://localhost:3000
2. Click "Chris"
3. Click "Start Stream"
4. Allow camera/microphone permissions
5. Your video should appear

**Window 2 (Viewer):**
1. Open http://localhost:3000 in a new incognito/private window
2. Click "Nick"
3. You should see a notification that Chris is streaming
4. Click "Join Stream"
5. You should see Chris's video

**Window 3 (Another Viewer):**
1. Open http://localhost:3000 in another incognito window
2. Click "Angel"
3. Join Chris's stream

## 🎯 Key Features to Test

### 1. Start a Stream
- Select a user
- Click "Start Stream"
- Grant camera permissions
- See your video preview

### 2. Join as Viewer
- Other users get notified
- Click "Join Stream"
- Watch the live broadcast

### 3. Real-time Updates
- Viewers see who joins/leaves
- Streamer sees viewer count
- Notifications appear for stream events

### 4. End Stream & Save
- Streamer clicks "Finish Stream"
- Video metadata saved to SQLite
- Appears in "Past Videos" section

### 5. Video History
- Scroll to "Past Videos"
- See all recorded streams
- Shows streamer, date, duration, viewers

## 🧪 Testing Tips

### Browser Testing
- **Chrome/Edge**: Best WebRTC support
- **Firefox**: Also works well
- **Safari**: May need extra permissions

### Multi-User Testing
```bash
# Window 1: Regular Chrome
http://localhost:3000 → Chris

# Window 2: Incognito Chrome
http://localhost:3000 → Nick

# Window 3: Another Incognito
http://localhost:3000 → Angel
```

### Check Console Logs

**Frontend Console (F12):**
- Socket connection status
- WebRTC peer connection logs
- Stream events

**Backend Terminal:**
- User connections
- Stream start/end events
- WebRTC signaling messages

## 🐛 Common Issues & Fixes

### Camera Not Working
```bash
# Chrome: Check chrome://settings/content/camera
# Grant camera permissions when prompted
# Ensure no other app is using camera
```

### Connection Refused
```bash
# Make sure backend is running
# Check if port 3001 is available
lsof -i :3001

# Restart if needed
npm run dev
```

### WebRTC Not Connecting
```bash
# Check browser console for errors
# Verify both users are connected to Socket.IO
# Try refreshing both windows
```

### Port Already in Use
```bash
# Kill processes on ports 3000 or 3001
npx kill-port 3000 3001

# Then restart
npm run dev
```

## 📂 Project Structure Overview

```
friends-stream/
├── src/                    Frontend React app
│   ├── components/        UI components
│   ├── hooks/            WebRTC logic
│   └── contexts/         User state
├── server/               Backend Express app
│   ├── index.js         Socket.IO server
│   └── db.js            SQLite database
└── package.json         Dependencies
```

## 🔧 Development Commands

```bash
# Start both frontend and backend
npm run dev

# Frontend only (port 3000)
npm run dev:client

# Backend only (port 3001)
npm run dev:server

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Customization Quick Tips

### Add More Users
Edit `src/types/index.ts`:
```typescript
export type User = 'Chris' | 'Nick' | 'Angel' | 'YourName'
```

Edit `src/components/UserSelector.tsx`:
```typescript
const users: User[] = ['Chris', 'Nick', 'Angel', 'YourName']
```

### Change Theme Colors
Edit `src/index.css` CSS variables.

### Modify UI
All components in `src/components/` use Tailwind CSS classes.

## 📊 Database Location

SQLite database is created at: `server/videos.db`

View contents:
```bash
sqlite3 server/videos.db "SELECT * FROM videos;"
```

## 🚀 Next Steps

Once you've tested the basic functionality:

1. **Customize the UI** - Add your own styling
2. **Add Features** - Implement video recording
3. **Deploy** - Host on Vercel (frontend) + Railway (backend)
4. **Enhance** - Add chat, screen sharing, etc.

## 📚 Additional Resources

- [WebRTC Documentation](https://webrtc.org/getting-started/overview)
- [Socket.IO Docs](https://socket.io/docs/)
- [ShadCN UI Components](https://ui.shadcn.com/)
- [Vite Guide](https://vitejs.dev/guide/)

## 💡 Pro Tips

1. **Use Chrome DevTools** → Application → Network → WS to see Socket.IO messages
2. **Check WebRTC Internals** → chrome://webrtc-internals for connection details
3. **Enable Verbose Logging** → Add console.logs in hooks for debugging
4. **Test on Same Network** → Works best when both devices are on same WiFi

---

**Happy Streaming! 🎥**

Need help? Check the main [README.md](README.md) for detailed documentation.
