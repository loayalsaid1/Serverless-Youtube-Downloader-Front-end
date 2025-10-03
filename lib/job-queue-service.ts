import { toast } from "sonner"
import { storageService } from "@/lib/storage"
import { getYouTubeThumbnail } from "@/lib/validators"
import type { Job, DownloadFormat } from "@/lib/types"

export class JobQueueService {
  private jobs: Job[] = []
  private listeners: Set<(jobs: Job[]) => void> = new Set()

  constructor() {
    this.loadJobsFromStorage()
  }

  private loadJobsFromStorage(): void {
    this.jobs = storageService.getJobs()
    this.notifyListeners()
  }

  private saveJobsToStorage(): void {
    storageService.saveJobs(this.jobs)
    this.notifyListeners()
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.jobs]))
  }

  subscribe(listener: (jobs: Job[]) => void): () => void {
    this.listeners.add(listener)
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  getJobs(): Job[] {
    return [...this.jobs]
  }

  getActiveJobs(): Job[] {
    return this.jobs.filter(job => 
      job.status === "PENDING" || 
      job.status === "QUEUED" || 
      job.status === "PROCESSING"
    )
  }

  getCompletedJobs(): Job[] {
    return this.jobs.filter(job => 
      job.status === "COMPLETED" || 
      job.status === "FAILED"
    )
  }

  addPendingJob(job: Omit<Job, 'jobId' | 'createdAt'> & { jobId: string }): void {
    const newJob: Job = {
      ...job,
      createdAt: new Date().toISOString(),
      thumbnailUrl: getYouTubeThumbnail(job.videoId)
    }
    
    this.jobs = [newJob, ...this.jobs]
    this.saveJobsToStorage()
  }

  updateJob(jobId: string, updates: Partial<Job>): void {
    this.jobs = this.jobs.map(job => 
      job.jobId === jobId ? { ...job, ...updates } : job
    )
    this.saveJobsToStorage()
  }

  updatePendingJobWithServerId(videoId: string, format: DownloadFormat, serverJobId: string): boolean {
    const pendingJobIndex = this.jobs.findIndex(
      job => job.isPending && job.videoId === videoId && job.format === format
    )

    if (pendingJobIndex !== -1) {
      const pendingJob = this.jobs[pendingJobIndex]
      const confirmedJob: Job = {
        ...pendingJob,
        jobId: serverJobId,
        status: "QUEUED",
        isPending: false
      }
      
      this.jobs[pendingJobIndex] = confirmedJob
      this.saveJobsToStorage()
      return true
    }
    
    return false
  }

  createJobFromServer(jobId: string, videoId: string, format: DownloadFormat, createdAt?: string): void {
    const newJob: Job = {
      jobId,
      videoId,
      format,
      status: "QUEUED",
      createdAt: createdAt || new Date().toISOString(),
      thumbnailUrl: getYouTubeThumbnail(videoId)
    }
    
    this.jobs = [newJob, ...this.jobs]
    this.saveJobsToStorage()
  }

  clearCompleted(): void {
    storageService.clearCompletedJobs()
    this.loadJobsFromStorage()
    toast.success("Cleared completed jobs")
  }

  refresh(): void {
    this.loadJobsFromStorage()
  }
}

// Singleton instance
export const jobQueueService = new JobQueueService()
