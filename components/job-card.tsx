"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import { JobStatusBadge } from "@/components/job-status-badge"
import type { Job } from "@/lib/types"
import Image from "next/image"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const handleDownload = () => {
    if (job.downloadUrl) {
      window.open(job.downloadUrl, "_blank")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className={`p-4 ${job.isPending ? 'opacity-80' : ''}`}>
      <div className="flex gap-4">
        {/* Thumbnail */}
        {job.thumbnailUrl && (
          <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
            <Image
              src={job.thumbnailUrl || "/placeholder.svg"}
              alt={job.videoTitle || "Video thumbnail"}
              fill
              className={`object-cover ${job.isPending ? 'opacity-70' : ''}`}
            />
            {job.isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="text-xs text-white font-medium px-2 py-1 bg-black/40 rounded">Connecting...</span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{job.videoTitle || `Video ${job.videoId}`}</h3>
              <p className="text-sm text-muted-foreground">
                {job.format.toUpperCase()} • {formatDate(job.createdAt)}
              </p>
            </div>
            <JobStatusBadge status={job.status} />
          </div>

          {/* Error message */}
          {job.status === "FAILED" && job.error && (
            <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{job.error}</p>
          )}

          {/* Actions */}
          {job.status === "COMPLETED" && job.downloadUrl && (
            <div className="flex gap-2">
              <Button onClick={handleDownload} size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://youtube.com/watch?v=${job.videoId}`, "_blank")}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Original
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
