"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { DownloadForm } from "@/components/download-form"
import { JobQueue } from "@/components/job-queue"
import { EmptyState } from "@/components/empty-state"
import { useWebSocket } from "@/hooks/use-websocket"
import { useJobQueue } from "@/hooks/use-job-queue"
import { useUndoneJobsSync } from "@/hooks/use-undone-jobs-sync"

// Replace with your actual WebSocket URL
const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "wss://your-api-gateway-url.execute-api.region.amazonaws.com/production"

export default function Home() {
  const { isConnected, lastMessage } = useWebSocket(WS_URL)
  const { activeJobs, completedJobs, clearCompleted, refreshJobs } = useJobQueue(lastMessage)
  const [mounted, setMounted] = useState(false)

  // Sync undone jobs when WebSocket connects (on mount/reload)
  const { hasSynced } = useUndoneJobsSync(isConnected)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const hasJobs = activeJobs.length > 0 || completedJobs.length > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header isConnected={isConnected} />

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl flex-1">
        <div className="space-y-4 sm:space-y-6">
          <DownloadForm onJobSubmitted={refreshJobs} />

          {hasJobs ? (
            <JobQueue activeJobs={activeJobs} completedJobs={completedJobs} onClearCompleted={clearCompleted} />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Download YouTube videos in multiple formats. Built with Next.js and AWS Serverless Backend.</p>
        </div>
      </footer>
    </div>
  )
}
