"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { storageService } from "@/lib/storage"
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
        // Job was queued successfully
        updateJobStatus(payload.jobId, {
          status: "QUEUED",
        })
        break

      case "jobStatusChanged":
        // Job status changed
        if (payload.status) {
          updateJobStatus(payload.jobId, {
            status: payload.status,
            videoTitle: payload.videoTitle,
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
        // File is ready for download
        updateJobStatus(payload.jobId, {
          status: "COMPLETED",
          downloadUrl: payload.fileUrl,
          videoTitle: payload.videoTitle,
          completedAt: new Date().toISOString(),
        })

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

  const activeJobs = jobs.filter((job) => job.status === "QUEUED" || job.status === "PROCESSING")
  const completedJobs = jobs.filter((job) => job.status === "COMPLETED" || job.status === "FAILED")

  return {
    jobs,
    activeJobs,
    completedJobs,
    clearCompleted,
    refreshJobs,
  }
}
