/**
 * Local storage service for persisting jobs and settings
 */

import type { Job, Settings } from "./types"

const STORAGE_KEYS = {
  JOBS: "youtube-downloader-jobs",
  SETTINGS: "youtube-downloader-settings",
} as const

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  defaultFormat: "mp4",
  notifications: true,
}

export const storageService = {
  // Jobs
  getJobs(): Job[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.JOBS)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  saveJobs(jobs: Job[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs))
    } catch (error) {
      console.error("Failed to save jobs:", error)
    }
  },

  addJob(job: Job): void {
    const jobs = this.getJobs()
    jobs.unshift(job)
    // Keep only last 50 jobs
    this.saveJobs(jobs.slice(0, 50))
  },

  updateJob(jobId: string, updates: Partial<Job>): void {
    const jobs = this.getJobs()
    const index = jobs.findIndex((j) => j.jobId === jobId)
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updates }
      this.saveJobs(jobs)
    }
  },

  clearCompletedJobs(): void {
    const jobs = this.getJobs()
    const activeJobs = jobs.filter((job) => job.status === "PENDING" || job.status === "QUEUED" || job.status === "PROCESSING")
    this.saveJobs(activeJobs)
  },

  getUndoneJobs(): Job[] {
    const jobs = this.getJobs()
    return jobs.filter((job) => job.status !== "COMPLETED" && job.status !== "FAILED")
  },

  // Settings
  getSettings(): Settings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  },

  saveSettings(settings: Partial<Settings>): void {
    try {
      const current = this.getSettings()
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...current, ...settings }))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  },
}
