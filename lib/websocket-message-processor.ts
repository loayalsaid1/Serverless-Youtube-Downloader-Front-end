import type { WebSocketMessage } from "@/lib/types"
import { 
  JobQueuedHandler, 
  JobStatusChangedHandler, 
  FileReadyHandler,
  type WebSocketEventHandler 
} from "@/lib/websocket-event-handlers"

export class WebSocketMessageProcessor {
  private handlers: Map<string, WebSocketEventHandler> = new Map()

  constructor() {
    this.registerHandlers()
  }

  private registerHandlers(): void {
    this.handlers.set("jobQueued", new JobQueuedHandler())
    this.handlers.set("jobStatusChanged", new JobStatusChangedHandler())
    this.handlers.set("fileReady", new FileReadyHandler())
  }

  processMessage(message: WebSocketMessage): void {
    const { type, payload } = message
    
    const handler = this.handlers.get(type)
    if (handler) {
      try {
        handler.handle(payload)
      } catch (error) {
        console.error(`Error processing ${type} message:`, error)
      }
    } else {
      console.warn(`No handler found for message type: ${type}`)
    }
  }
}

// Singleton instance
export const webSocketMessageProcessor = new WebSocketMessageProcessor()
