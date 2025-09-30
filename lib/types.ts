export type DownloadFormat = "mp4" | "mp3" | "txt" | "srt"

export type JobStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED"

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
}

export interface WebSocketMessage {
  type: "jobQueued" | "fileReady" | "jobStatusChanged"
  payload: {
    jobId: string
    fileUrl?: string
    status?: JobStatus
    videoTitle?: string
    thumbnailUrl?: string
    error?: string
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
