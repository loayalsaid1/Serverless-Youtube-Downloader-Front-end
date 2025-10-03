"use client"

import { useState, useEffect } from "react"
import { jobQueueService } from "@/lib/job-queue-service"
import { webSocketMessageProcessor } from "@/lib/websocket-message-processor"
import type { Job, WebSocketMessage } from "@/lib/types"

export function useJobQueue(lastMessage: WebSocketMessage | null) {
  const [jobs, setJobs] = useState<Job[]>([])

  // Subscribe to job queue changes
  useEffect(() => {
    const unsubscribe = jobQueueService.subscribe(setJobs)
    
    // Initial load
    setJobs(jobQueueService.getJobs())
    
    return unsubscribe
  }, [])

  // Process WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      webSocketMessageProcessor.processMessage(lastMessage)
    }
  }, [lastMessage])

  return {
    jobs,
    activeJobs: jobQueueService.getActiveJobs(),
    completedJobs: jobQueueService.getCompletedJobs(),
    clearCompleted: () => jobQueueService.clearCompleted(),
    refreshJobs: () => jobQueueService.refresh(),
  }
}
