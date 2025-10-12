"use client"

import { useEffect, useRef } from "react"
import { storageService } from "@/lib/storage"
import { getWebSocketService } from "@/lib/websocket-service"
import type { Job, DownloadRequest } from "@/lib/types"

/**
 * Hook that runs on mount/reload to sync undone jobs with the backend.
 * This ensures that when a user reloads the page and creates a new WebSocket connection,
 * the backend subscribes the new connection to updates for any pending/processing jobs.
 * 
 * @param isConnected - WebSocket connection status
 */
export function useUndoneJobsSync(isConnected: boolean) {
  const hasSynced = useRef(false)

  useEffect(() => {
    // Only sync once when the WebSocket becomes connected
    if (!isConnected || hasSynced.current) {
      return
    }

    const syncUndoneJobs = async () => {
      try {
        // Get undone jobs using the storage helper
        const undoneJobs = storageService.getUndoneJobs()

        if (undoneJobs.length === 0) {
          console.log("[UndoneJobsSync] No undone jobs to sync")
          hasSynced.current = true
          return
        }

        console.log(`[UndoneJobsSync] Syncing ${undoneJobs.length} undone jobs:`, undoneJobs)

        const ws = getWebSocketService()

        // Verify WebSocket is actually connected before sending
        if (!ws.isConnected()) {
          console.warn("[UndoneJobsSync] WebSocket not connected, skipping sync")
          return
        }

        // Send requestVideo message for each undone job
        undoneJobs.forEach((job: Job) => {
          // Validate job data before sending
          if (!job.videoId || !job.format) {
            console.warn(`[UndoneJobsSync] Skipping job ${job.jobId} - missing videoId or format`, job)
            return
          }

          const request: DownloadRequest = {
            action: "requestVideo",
            payload: {
              videoId: job.videoId,
              format: job.format
            }
          }

          console.log(`[UndoneJobsSync] Requesting video updates for job ${job.jobId} (videoId: ${job.videoId}, format: ${job.format})`)
          ws.send(request)
        })

        hasSynced.current = true
        console.log("[UndoneJobsSync] Successfully synced all undone jobs")
      } catch (error) {
        console.error("[UndoneJobsSync] Error syncing undone jobs:", error)
        // Don't mark as synced if there was an error, so it can retry on next connection
      }
    }

    // Small delay to ensure WebSocket is fully established
    const timeoutId = setTimeout(syncUndoneJobs, 150)

    return () => clearTimeout(timeoutId)
  }, [isConnected])

  // Reset sync flag when disconnected (allows re-sync on reconnection)
  useEffect(() => {
    if (!isConnected) {
      hasSynced.current = false
    }
  }, [isConnected])

  // Return sync status for debugging purposes
  return { hasSynced: hasSynced.current }
}
