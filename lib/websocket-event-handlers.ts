import { toast } from "sonner"
import { jobQueueService } from "@/lib/job-queue-service"
import type { WebSocketMessage } from "@/lib/types"

export interface WebSocketEventHandler {
  handle(payload: WebSocketMessage['payload']): void
}

export class JobQueuedHandler implements WebSocketEventHandler {
  handle(payload: WebSocketMessage['payload']): void {
    const { jobId, videoId, format, createdAt } = payload
    
    if (!jobId || !videoId || !format) {
      console.warn("Invalid jobQueued payload:", payload)
      return
    }

    // Try to update pending job first
    const wasUpdated = jobQueueService.updatePendingJobWithServerId(videoId, format, jobId)
    
    if (wasUpdated) {
      console.log(`Pending job updated with server jobId: ${jobId}`)
    } else {
      // If no matching pending job, create a new one (could happen on reconnect)
      jobQueueService.createJobFromServer(jobId, videoId, format, createdAt)
      console.log(`New job created from server: ${jobId}`)
    }
  }
}

export class JobStatusChangedHandler implements WebSocketEventHandler {
  handle(payload: WebSocketMessage['payload']): void {
    const { jobId, status, videoTitle, fileUrl, error } = payload
    
    if (!jobId || !status) {
      console.warn("Invalid jobStatusChanged payload:", payload)
      return
    }

    const updates = {
      status,
      videoTitle,
      error,
      ...(status === "COMPLETED" ? { 
        downloadUrl: fileUrl,
        completedAt: new Date().toISOString()
      } : {}),
    }

    jobQueueService.updateJob(jobId, updates)

    // Show notifications
    this.showStatusNotification(status, videoTitle, error)
  }

  private showStatusNotification(status: string, videoTitle?: string, error?: string): void {
    if (status === "COMPLETED") {
      toast.success("Download ready!", {
        description: videoTitle || "Your download is ready",
      })
    } else if (status === "FAILED") {
      toast.error("Download failed", {
        description: error || "Something went wrong",
      })
    }
  }
}

export class FileReadyHandler implements WebSocketEventHandler {
  handle(payload: WebSocketMessage['payload']): void {
    const { videoId, format, fileUrl, videoTitle } = payload
    
    if (!videoId || !format || !fileUrl) {
      console.warn("Invalid fileReady payload:", payload)
      return
    }

    console.log("File ready message received:", payload)
    
    // Find pending job and update it
    const jobs = jobQueueService.getJobs()
    const pendingJob = jobs.find(job => 
      job.isPending && job.videoId === videoId && job.format === format
    )
    
    if (pendingJob) {
      jobQueueService.updateJob(pendingJob.jobId, {
        status: "COMPLETED",
        downloadUrl: fileUrl,
        videoTitle,
        completedAt: new Date().toISOString(),
        isPending: false
      })
    }

    toast.success("Download ready!", {
      description: videoTitle || "Your download is ready",
    })
  }
}
