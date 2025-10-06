import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { VideoPlayer } from './VideoPlayer'
import { useMediaStream } from '@/hooks/useMediaStream'
import { Video as VideoIcon, VideoOff, Users } from 'lucide-react'
import { User } from '@/types'

interface StreamViewProps {
  onStartStream: (stream: MediaStream) => void
  onEndStream: () => void
  isStreaming: boolean
  viewers: User[]
}

export function StreamView({ onStartStream, onEndStream, isStreaming, viewers }: StreamViewProps) {
  const { stream, error, isLoading, startCamera, stopCamera } = useMediaStream()

  const handleStartStream = async () => {
    await startCamera()
  }

  useEffect(() => {
    if (stream && !isStreaming) {
      onStartStream(stream)
    }
  }, [stream])

  const handleFinish = () => {
    stopCamera()
    onEndStream()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Stream</span>
            {isStreaming && (
              <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{viewers.length} {viewers.length === 1 ? 'viewer' : 'viewers'}</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            {stream ? (
              <VideoPlayer stream={stream} muted={true} />
            ) : (
              <div className="text-center text-muted-foreground">
                <VideoOff className="w-16 h-16 mx-auto mb-2" />
                <p>Camera preview will appear here</p>
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}

          {!isStreaming ? (
            <Button
              onClick={handleStartStream}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <VideoIcon className="mr-2" />
              {isLoading ? 'Starting...' : 'Start Stream'}
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              variant="destructive"
              className="w-full"
              size="lg"
            >
              Finish Stream
            </Button>
          )}

          {isStreaming && viewers.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Joined:</p>
              <p>{viewers.join(', ')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
