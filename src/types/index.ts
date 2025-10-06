export type User = 'Chris' | 'Nick' | 'Angel'

export interface Video {
  id: string
  streamer_name: User
  timestamp: string
  duration: number
  viewers: User[]
  video_url?: string
}

export interface StreamState {
  isActive: boolean
  streamId: string | null
  streamer: User | null
  viewers: User[]
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'stream-started' | 'stream-ended' | 'viewer-joined' | 'viewer-left'
  from: User
  to?: User
  streamId?: string
  data?: any
}
