export type DownloadFormat = "mp4" | "mp3" | "txt" | "srt"

export type JobStatus = "PENDING" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED"

export interface Job {
  jobId: string
  videoId: string
  format: DownloadFormat
  status: JobStatus
  createdAt: string
  completedAt?: string
  downloadUrl?: string
  videoTitle?: string
  thumbnailUrl?: string
  error?: string
  isPending?: boolean // Flag to identify temporary jobs waiting for server confirmation
}

export interface WebSocketMessage {
  type: "jobQueued" | "fileReady" | "jobStatusChanged"
  payload: {
    jobId: string
    videoId?: string
    format?: DownloadFormat
    fileUrl?: string
    status?: JobStatus
    videoTitle?: string
    thumbnailUrl?: string
    error?: string
    createdAt?: string
  }
}

export interface DownloadRequest {
  action: "requestVideo",
  payload: {
    videoId: string
    format: DownloadFormat
  }
}

export interface Settings {
  theme: "light" | "dark" | "system"
  defaultFormat: DownloadFormat
  notifications: boolean
}
