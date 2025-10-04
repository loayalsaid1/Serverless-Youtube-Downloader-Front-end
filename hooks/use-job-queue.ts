"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { storageService } from "@/lib/storage"
import { jobQueuedEventHandler } from "@/lib/jobQueued-event-handler"
import { getYouTubeThumbnail } from "@/lib/validators"
import type { Job, WebSocketMessage } from "@/lib/types"

export function useJobQueue(lastMessage: WebSocketMessage | null) {
  const [jobs, setJobs] = useState<Job[]>([])

  // Load jobs from storage on mount
  useEffect(() => {
    const storedJobs = storageService.getJobs()
    setJobs(storedJobs)
  }, [])

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return

    const { type, payload } = lastMessage

    switch (type) {
      case "jobQueued":
        // Find any pending job with matching videoId and format
        if (payload.videoId && payload.format) {
          setJobs(prevJobs => 
            jobQueuedEventHandler.handleJobQueued(prevJobs, {
              jobId: payload.jobId,
              videoId: payload.videoId!,
              format: payload.format!,
              createdAt: payload.createdAt
            })
          )
        }
        break

      case "jobStatusChanged":
        // Job status changed
        if (payload.status) {
          updateJobStatus(payload.jobId, {
            status: payload.status,
            videoTitle: payload.videoTitle,
            ...(payload.status === "COMPLETED" ? { downloadUrl: payload.fileUrl } : {}),
            error: payload.error,
          })

          // Show notification for completed/failed jobs
          if (payload.status === "COMPLETED") {
            toast.success("Download ready!", {
              description: payload.videoTitle || "Your download is ready",
            })
          } else if (payload.status === "FAILED") {
            toast.error("Download failed", {
              description: payload.error || "Something went wrong",
            })
          }
        }
        break

      case "fileReady":
        console.log("File ready message received:", payload)
        // File is ready for download
        // Get the pending job with format and videoId
        const pendingJob = jobs.find(job => job.isPending && job.videoId === payload.videoId && job.format === payload.format)
        if (pendingJob) {
          updateJobStatus(pendingJob.jobId, {
            status: "COMPLETED",
            downloadUrl: payload.fileUrl,
            videoTitle: payload.videoTitle,
            completedAt: new Date().toISOString(),
            isPending: false
          })
        }

        toast.success("Download ready!", {
          description: payload.videoTitle || "Your download is ready",
        })
        break
    }
  }, [lastMessage])

  const updateJobStatus = useCallback((jobId: string, updates: Partial<Job>) => {
    setJobs((prevJobs) => {
      const updatedJobs = prevJobs.map((job) => (job.jobId === jobId ? { ...job, ...updates } : job))

      // Save to storage
      storageService.saveJobs(updatedJobs)

      return updatedJobs
    })
  }, [])

  const clearCompleted = useCallback(() => {
    storageService.clearCompletedJobs()
    setJobs(storageService.getJobs())
    toast.success("Cleared completed jobs")
  }, [])

  const refreshJobs = useCallback(() => {
    setJobs(storageService.getJobs())
  }, [])

  const activeJobs = jobs.filter((job) => job.status === "PENDING" || job.status === "QUEUED" || job.status === "PROCESSING")
  const completedJobs = jobs.filter((job) => job.status === "COMPLETED" || job.status === "FAILED")

  return {
    jobs,
    activeJobs,
    completedJobs,
    clearCompleted,
    refreshJobs,
  }
}
