"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { extractVideoId, getYouTubeThumbnail } from "@/lib/validators"
import { storageService } from "@/lib/storage"
import type { DownloadFormat, Job } from "@/lib/types"
import { getWebSocketService } from "@/lib/websocket-service"

export function useDownloader() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitDownload = useCallback(async (url: string, format: DownloadFormat) => {
    const videoId = extractVideoId(url)

    if (!videoId) {
      toast.error("Invalid YouTube URL", {
        description: "Please enter a valid YouTube video URL",
      })
      return null
    }

    setIsSubmitting(true)

    try {
      const ws = getWebSocketService()

      // Generate temporary ID for UI tracking
      const tempId = `temp-${videoId}-${format}-${Date.now()}`

      // Create temporary job object with PENDING status
      const job: Job = {
        jobId: tempId,
        videoId,
        format,
        status: "PENDING", // Use PENDING until confirmed by server
        createdAt: new Date().toISOString(),
        thumbnailUrl: getYouTubeThumbnail(videoId),
        isPending: true, // Flag to identify this is a pending job
      }

      // Save to local storage
      storageService.addJob(job)

      // Send request via WebSocket
      ws.send({
        action: "requestVideo",
        payload: {
          videoId,
          format,
        }
      })

      toast.success("Download request submitted", {
        description: `Your ${format.toUpperCase()} download is being processed`,
      })

      return job
    } catch (error) {
      console.error("[v0] Failed to submit download:", error)
      toast.error("Failed to submit download", {
        description: "Please check your connection and try again",
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return {
    submitDownload,
    isSubmitting,
  }
}
