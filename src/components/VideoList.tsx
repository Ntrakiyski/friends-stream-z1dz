import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Play, Users } from 'lucide-react'
import { Video } from '@/types'
import { formatDate, formatDuration } from '@/lib/utils'

export function VideoList() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/videos')
      const data = await response.json()
      setVideos(data)
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Past Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Videos</CardTitle>
      </CardHeader>
      <CardContent>
        {videos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No videos yet. Start streaming to create your first video!
          </p>
        ) : (
          <div className="space-y-2">
            {videos.map(video => (
              <div
                key={video.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Play className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium">{video.streamer_name}</h4>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(video.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDuration(video.duration)}
                  </p>
                  {video.viewers.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Users className="w-3 h-3" />
                      <span>Joined: {video.viewers.join(', ')}</span>
                    </div>
                  )}
                </div>
                <Button size="sm" variant="ghost">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
