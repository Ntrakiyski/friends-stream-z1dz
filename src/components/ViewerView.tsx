import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { VideoPlayer } from './VideoPlayer'
import { Video as VideoIcon } from 'lucide-react'
import { User } from '@/types'

interface ViewerViewProps {
  streamer: User
  stream: MediaStream | null
  onJoin: () => void
  onLeave: () => void
  isViewing: boolean
}

export function ViewerView({ streamer, stream, onJoin, onLeave, isViewing }: ViewerViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{streamer}'s Live Stream</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isViewing && stream ? (
          <>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <VideoPlayer stream={stream} muted={false} />
            </div>
            <Button
              onClick={onLeave}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Leave Stream
            </Button>
          </>
        ) : (
          <>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <VideoIcon className="w-16 h-16 mx-auto mb-2" />
                <p>{streamer} is live!</p>
              </div>
            </div>
            <Button
              onClick={onJoin}
              className="w-full"
              size="lg"
            >
              Join Stream
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
