import { useState, useEffect, useRef } from 'react'

export function useMediaStream() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const startCamera = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      })
      setStream(mediaStream)
    } catch (err) {
      setError('Failed to access camera. Please grant permission.')
      console.error('Error accessing media devices:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return {
    stream,
    error,
    isLoading,
    startCamera,
    stopCamera
  }
}
