import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const db = new Database(join(__dirname, 'videos.db'))

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    streamer_name TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    duration INTEGER NOT NULL,
    viewers TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

export function getAllVideos() {
  const videos = db.prepare('SELECT * FROM videos ORDER BY created_at DESC').all()
  return videos.map(video => ({
    ...video,
    viewers: JSON.parse(video.viewers)
  }))
}

export function createVideo(videoData) {
  const { streamId, streamer_name, duration, viewers } = videoData
  const timestamp = new Date().toISOString()
  
  const stmt = db.prepare(`
    INSERT INTO videos (id, streamer_name, timestamp, duration, viewers)
    VALUES (?, ?, ?, ?, ?)
  `)
  
  stmt.run(streamId, streamer_name, timestamp, duration, JSON.stringify(viewers))
  
  return {
    id: streamId,
    streamer_name,
    timestamp,
    duration,
    viewers
  }
}

export function getVideoById(id) {
  const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(id)
  if (video) {
    video.viewers = JSON.parse(video.viewers)
  }
  return video
}

export default db
