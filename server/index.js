import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { getAllVideos, createVideo } from './db.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

// Store active streams and users
const activeStreams = new Map() // streamId -> { streamer, viewers: [] }
const connectedUsers = new Map() // socketId -> username

// REST API endpoints
app.get('/api/videos', (req, res) => {
  try {
    const videos = getAllVideos()
    res.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    res.status(500).json({ error: 'Failed to fetch videos' })
  }
})

app.post('/api/videos', (req, res) => {
  try {
    const video = createVideo(req.body)
    res.json(video)
  } catch (error) {
    console.error('Error creating video:', error)
    res.status(500).json({ error: 'Failed to create video' })
  }
})

// Socket.IO signaling server
io.on('connection', (socket) => {
  const username = socket.handshake.query.username
  connectedUsers.set(socket.id, username)
  console.log(`${username} connected (${socket.id})`)

  // Start stream
  socket.on('start-stream', ({ streamId, streamer }) => {
    activeStreams.set(streamId, { streamer, viewers: [] })
    console.log(`Stream started: ${streamId} by ${streamer}`)
    
    // Notify all clients
    io.emit('stream-started', { streamId, streamer })
  })

  // End stream
  socket.on('end-stream', ({ streamId }) => {
    const stream = activeStreams.get(streamId)
    if (stream) {
      console.log(`Stream ended: ${streamId}`)
      activeStreams.delete(streamId)
      io.emit('stream-ended', { streamId })
    }
  })

  // Join stream
  socket.on('join-stream', ({ streamId, viewer }) => {
    const stream = activeStreams.get(streamId)
    if (stream && !stream.viewers.includes(viewer)) {
      stream.viewers.push(viewer)
      console.log(`${viewer} joined stream ${streamId}`)
      
      // Notify streamer and other viewers
      io.emit('viewer-joined', { streamId, viewer })
    }
  })

  // Leave stream
  socket.on('leave-stream', ({ streamId, viewer }) => {
    const stream = activeStreams.get(streamId)
    if (stream) {
      stream.viewers = stream.viewers.filter(v => v !== viewer)
      console.log(`${viewer} left stream ${streamId}`)
      
      io.emit('viewer-left', { streamId, viewer })
    }
  })

  // WebRTC signaling
  socket.on('signal', (message) => {
    console.log(`Signal: ${message.type} from ${message.from}`)
    
    if (message.to) {
      // Send to specific user
      const targetSocket = Array.from(connectedUsers.entries())
        .find(([_, username]) => username === message.to)?.[0]
      
      if (targetSocket) {
        io.to(targetSocket).emit(message.type, {
          from: message.from,
          [message.type === 'offer' ? 'offer' : 
           message.type === 'answer' ? 'answer' : 
           'candidate']: message.data
        })
      }
    } else {
      // Broadcast to all except sender
      socket.broadcast.emit(message.type, message)
    }
  })

  // Disconnect
  socket.on('disconnect', () => {
    const username = connectedUsers.get(socket.id)
    console.log(`${username} disconnected`)
    connectedUsers.delete(socket.id)
    
    // Remove from any active streams
    activeStreams.forEach((stream, streamId) => {
      if (stream.streamer === username) {
        activeStreams.delete(streamId)
        io.emit('stream-ended', { streamId })
      } else if (stream.viewers.includes(username)) {
        stream.viewers = stream.viewers.filter(v => v !== username)
        io.emit('viewer-left', { streamId, viewer: username })
      }
    })
  })
})

const PORT = 3001

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Socket.IO server ready for WebRTC signaling`)
})
