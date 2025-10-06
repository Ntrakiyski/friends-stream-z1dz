import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useSignaling } from '@/hooks/useSignaling'
import { useWebRTC } from '@/hooks/useWebRTC'
import { UserSelector } from '@/components/UserSelector'
import { StreamView } from '@/components/StreamView'
import { ViewerView } from '@/components/ViewerView'
import { VideoList } from '@/components/VideoList'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

function App() {
  const { currentUser, setCurrentUser } = useUser()
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [streamId, setStreamId] = useState<string | null>(null)
  const [isViewing, setIsViewing] = useState(false)

  const {
    streamState,
    notifications,
    startStream,
    endStream,
    joinStream,
    leaveStream,
    socket,
    clearNotification
  } = useSignaling(currentUser)

  const isStreamer = currentUser === streamState.streamer
  const canViewStream = streamState.isActive && !isStreamer && currentUser !== null

  const { remoteStream, createOffer, closeConnection } = useWebRTC(
    socket,
    currentUser,
    localStream,
    isStreamer
  )

  const handleStartStream = async (stream: MediaStream) => {
    const newStreamId = `stream-${Date.now()}`
    setStreamId(newStreamId)
    setLocalStream(stream)
    startStream(newStreamId)
  }

  const handleEndStream = async () => {
    if (streamId) {
      // Save video to backend
      await fetch('http://localhost:3001/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamId,
          streamer_name: currentUser,
          duration: 120, // TODO: Calculate actual duration
          viewers: streamState.viewers
        })
      })

      endStream(streamId)
      setStreamId(null)
      setLocalStream(null)
    }
  }

  const handleJoinStream = () => {
    if (streamState.streamId && streamState.streamer) {
      joinStream(streamState.streamId)
      setIsViewing(true)
      createOffer(streamState.streamer)
    }
  }

  const handleLeaveStream = () => {
    if (streamState.streamId) {
      leaveStream(streamState.streamId)
      setIsViewing(false)
      closeConnection()
    }
  }

  if (!currentUser) {
    return <UserSelector onSelectUser={setCurrentUser} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Simple Video Messenger</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Logged in as <strong>{currentUser}</strong></span>
            {notifications.length > 0 && (
              <div className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="bg-accent border rounded-lg p-4 flex items-center justify-between"
                >
                  <p>{notification}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => clearNotification(index)}
                  >
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Stream Section */}
          {isStreamer ? (
            <StreamView
              onStartStream={handleStartStream}
              onEndStream={handleEndStream}
              isStreaming={!!streamId}
              viewers={streamState.viewers}
            />
          ) : canViewStream && streamState.streamer ? (
            <ViewerView
              streamer={streamState.streamer}
              stream={remoteStream}
              onJoin={handleJoinStream}
              onLeave={handleLeaveStream}
              isViewing={isViewing}
            />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No active streams</h2>
              <p className="text-muted-foreground">
                Start a stream or wait for someone to go live
              </p>
            </div>
          )}

          {/* Video History */}
          <VideoList />
        </div>
      </main>
    </div>
  )
}

export default App
