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

      // Generate job ID
      const jobId = `${videoId}-${format}-${Date.now()}`

      // Create job object
      const job: Job = {
        jobId,
        videoId,
        format,
        status: "QUEUED",
        createdAt: new Date().toISOString(),
        thumbnailUrl: getYouTubeThumbnail(videoId),
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

      toast.success("Download queued", {
        description: `Your ${format.toUpperCase()} download has been queued`,
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
