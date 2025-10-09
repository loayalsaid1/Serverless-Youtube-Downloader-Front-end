/**
 * WebSocket service for real-time communication with AWS API Gateway
 */

import type { WebSocketMessage, DownloadRequest } from "./types"

type MessageHandler = (message: WebSocketMessage) => void
type ConnectionHandler = (connected: boolean) => void

class WebSocketService {
  private ws: WebSocket | null = null
  private url: string
  private messageHandlers: Set<MessageHandler> = new Set()
  private connectionHandlers: Set<ConnectionHandler> = new Set()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isIntentionallyClosed = false
  private pendingJobs: DownloadRequest[] = []

  constructor(url: string) {
    this.url = url
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    this.isIntentionallyClosed = false

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log("[v0] WebSocket connected")
        this.reconnectAttempts = 0
        this.notifyConnectionHandlers(true)

        // Resubmit pending jobs after reconnection
        this.resubmitPendingJobs()
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          console.log("[v0] WebSocket message received:", message)
          this.notifyMessageHandlers(message)
        } catch (error) {
          console.error("[v0] Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onerror = (error) => {
        console.error("[v0] WebSocket error:", error)
      }

      this.ws.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        this.notifyConnectionHandlers(false)

        if (!this.isIntentionallyClosed) {
          this.attemptReconnect()
        }
      }
    } catch (error) {
      console.error("[v0] Failed to create WebSocket:", error)
      this.attemptReconnect()
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true
    this.ws?.close()
    this.ws = null
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[v0] Max reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    console.log(`[v0] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

    setTimeout(() => {
      this.connect()
    }, delay)
  }

  private resubmitPendingJobs(): void {
    if (this.pendingJobs.length === 0) return

    console.log(`[v0] Resubmitting ${this.pendingJobs.length} pending jobs`)

    const jobsToResubmit = [...this.pendingJobs]
    this.pendingJobs = []

    jobsToResubmit.forEach((job) => {
      this.send(job)
    })
  }

  send(data: DownloadRequest): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
      console.log("[v0] WebSocket message sent:", data)
      
      // Special logging for undone jobs sync
      if (data.action === "requestVideo") {
        console.log(`[v0] Requesting video updates for videoId: ${data.payload.videoId}, format: ${data.payload.format}`)
      }
    } else {
      console.warn("[v0] WebSocket not connected, queuing job")
      
      // Don't queue requestVideo messages as they're for syncing existing jobs
      if (data.action === "requestVideo") {
        console.warn("[v0] Cannot sync undone job - WebSocket not connected:", data)
        return
      }
      
      this.pendingJobs.push(data)
      this.connect()
    }
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler)
    // Immediately notify of current state
    handler(this.ws?.readyState === WebSocket.OPEN)
    return () => this.connectionHandlers.delete(handler)
  }

  private notifyMessageHandlers(message: WebSocketMessage): void {
    this.messageHandlers.forEach((handler) => handler(message))
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach((handler) => handler(connected))
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  addPendingJob(job: DownloadRequest): void {
    this.pendingJobs.push(job)
  }
}

// Singleton instance - will be initialized with actual URL from environment
let wsInstance: WebSocketService | null = null

export function getWebSocketService(url?: string): WebSocketService {
  if (!wsInstance && url) {
    wsInstance = new WebSocketService(url)
  }
  if (!wsInstance) {
    throw new Error("WebSocket service not initialized. Provide URL on first call.")
  }
  return wsInstance
}

export { WebSocketService }
