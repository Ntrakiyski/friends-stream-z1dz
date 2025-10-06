import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { User, SignalingMessage, StreamState } from '@/types'

export function useSignaling(currentUser: User | null) {
  const socketRef = useRef<Socket | null>(null)
  const [streamState, setStreamState] = useState<StreamState>({
    isActive: false,
    streamId: null,
    streamer: null,
    viewers: []
  })
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    if (!currentUser) return

    // Connect to signaling server
    socketRef.current = io('http://localhost:3001', {
      query: { username: currentUser }
    })

    const socket = socketRef.current

    socket.on('stream-started', ({ streamId, streamer }: { streamId: string, streamer: User }) => {
      if (streamer !== currentUser) {
        setNotifications(prev => [...prev, `${streamer} started a stream`])
      }
      setStreamState({
        isActive: true,
        streamId,
        streamer,
        viewers: []
      })
    })

    socket.on('stream-ended', ({ streamId }: { streamId: string }) => {
      setStreamState({
        isActive: false,
        streamId: null,
        streamer: null,
        viewers: []
      })
      setNotifications(prev => [...prev, 'Stream ended'])
    })

    socket.on('viewer-joined', ({ viewer }: { viewer: User }) => {
      setStreamState(prev => ({
        ...prev,
        viewers: [...prev.viewers, viewer]
      }))
    })

    socket.on('viewer-left', ({ viewer }: { viewer: User }) => {
      setStreamState(prev => ({
        ...prev,
        viewers: prev.viewers.filter(v => v !== viewer)
      }))
    })

    return () => {
      socket.disconnect()
    }
  }, [currentUser])

  const startStream = (streamId: string) => {
    if (socketRef.current && currentUser) {
      socketRef.current.emit('start-stream', { streamId, streamer: currentUser })
    }
  }

  const endStream = (streamId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('end-stream', { streamId })
    }
  }

  const joinStream = (streamId: string) => {
    if (socketRef.current && currentUser) {
      socketRef.current.emit('join-stream', { streamId, viewer: currentUser })
    }
  }

  const leaveStream = (streamId: string) => {
    if (socketRef.current && currentUser) {
      socketRef.current.emit('leave-stream', { streamId, viewer: currentUser })
    }
  }

  const sendSignal = (message: SignalingMessage) => {
    if (socketRef.current) {
      socketRef.current.emit('signal', message)
    }
  }

  const clearNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  return {
    socket: socketRef.current,
    streamState,
    notifications,
    startStream,
    endStream,
    joinStream,
    leaveStream,
    sendSignal,
    clearNotification
  }
}
