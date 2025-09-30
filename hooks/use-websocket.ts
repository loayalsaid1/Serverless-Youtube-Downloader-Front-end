"use client"

import { useEffect, useState, useCallback } from "react"
import { getWebSocketService } from "@/lib/websocket-service"
import type { WebSocketMessage } from "@/lib/types"

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  useEffect(() => {
    const ws = getWebSocketService(url)

    // Connect on mount
    ws.connect()

    // Subscribe to connection changes
    const unsubscribeConnection = ws.onConnectionChange((connected) => {
      setIsConnected(connected)
    })

    // Subscribe to messages
    const unsubscribeMessages = ws.onMessage((message) => {
      setLastMessage(message)
    })

    // Cleanup on unmount
    return () => {
      unsubscribeConnection()
      unsubscribeMessages()
    }
  }, [url])

  const send = useCallback((data: any) => {
    const ws = getWebSocketService()
    ws.send(data)
  }, [])

  return {
    isConnected,
    lastMessage,
    send,
  }
}
