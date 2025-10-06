import { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import { User } from '@/types'

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
}

export function useWebRTC(
  socket: Socket | null,
  currentUser: User | null,
  localStream: MediaStream | null,
  isStreamer: boolean
) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

  useEffect(() => {
    if (!socket || !currentUser) return

    const handleOffer = async ({ from, offer }: { from: User, offer: RTCSessionDescriptionInit }) => {
      if (isStreamer) return // Streamer doesn't handle offers

      const pc = new RTCPeerConnection(ICE_SERVERS)
      peerConnectionRef.current = pc

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('signal', {
            type: 'ice-candidate',
            from: currentUser,
            to: from,
            data: event.candidate
          })
        }
      }

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0])
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      socket.emit('signal', {
        type: 'answer',
        from: currentUser,
        to: from,
        data: answer
      })
    }

    const handleAnswer = async ({ from, answer }: { from: User, answer: RTCSessionDescriptionInit }) => {
      if (!isStreamer || !peerConnectionRef.current) return
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer))
    }

    const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate))
      }
    }

    socket.on('offer', handleOffer)
    socket.on('answer', handleAnswer)
    socket.on('ice-candidate', handleIceCandidate)

    return () => {
      socket.off('offer', handleOffer)
      socket.off('answer', handleAnswer)
      socket.off('ice-candidate', handleIceCandidate)
    }
  }, [socket, currentUser, isStreamer])

  const createOffer = async (targetUser: User) => {
    if (!socket || !currentUser || !localStream) return

    const pc = new RTCPeerConnection(ICE_SERVERS)
    peerConnectionRef.current = pc

    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream)
    })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', {
          type: 'ice-candidate',
          from: currentUser,
          to: targetUser,
          data: event.candidate
        })
      }
    }

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    socket.emit('signal', {
      type: 'offer',
      from: currentUser,
      to: targetUser,
      data: offer
    })
  }

  const closeConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    setRemoteStream(null)
  }

  return {
    remoteStream,
    createOffer,
    closeConnection
  }
}
