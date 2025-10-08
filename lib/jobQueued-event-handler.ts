import { storageService } from "./storage"
import { fetchVideoTitle, getYouTubeThumbnail } from "./YT-utils"
import type { Job, DownloadFormat } from "./types"

export const jobQueuedEventHandler = {
  /**
   * Handles the jobQueued event - either updates a pending job or creates a new one
   */
  async handleJobQueued(
    currentJobs: Job[],
    payload: { jobId: string; videoId: string; format: DownloadFormat; createdAt?: string }
  ): Promise<Job[]> {
    const { jobId, videoId, format } = payload

    // Try to find and update a pending job
    const updatedJobs = this.updatePendingJob(currentJobs, payload)
    if (updatedJobs) {
      storageService.saveJobs(updatedJobs)
      console.log(`Pending job updated with server jobId: ${jobId}`)
      return updatedJobs
    }

    // No pending job found, create a new one
    const newJobs = await this.createNewJob(currentJobs, payload)
    storageService.saveJobs(newJobs)
    return newJobs
  },

  /**
   * Updates a pending job with the server jobId
   */
  updatePendingJob(
    jobs: Job[],
    payload: { jobId: string; videoId: string; format: DownloadFormat }
  ): Job[] | null {
    const pendingJob = this.findPendingJob(jobs, payload.videoId, payload.format)
    
    if (!pendingJob) return null

    const confirmedJob: Job = {
      ...pendingJob,
      jobId: payload.jobId,
      status: "QUEUED",
      isPending: false
    }

    return jobs.map(job => 
      job.jobId === pendingJob.jobId ? confirmedJob : job
    )
  },

  /**
   * Creates a new job when no pending job is found
   */
  async createNewJob(
    jobs: Job[],
    payload: { jobId: string; videoId: string; format: DownloadFormat; createdAt?: string }
  ): Promise<Job[]> {
    const newJob: Job = {
      jobId: payload.jobId,
      videoId: payload.videoId,
      format: payload.format,
      status: "QUEUED",
      createdAt: payload.createdAt || new Date().toISOString(),
      thumbnailUrl: getYouTubeThumbnail(payload.videoId),
      videoTitle: await fetchVideoTitle(payload.videoId) || undefined
    }

    return [newJob, ...jobs]
  },

  /**
   * Finds a pending job by videoId and format
   */
  findPendingJob(jobs: Job[], videoId: string, format: DownloadFormat): Job | undefined {
    return jobs.find(
      job => job.isPending && job.videoId === videoId && job.format === format
    )
  }
}
