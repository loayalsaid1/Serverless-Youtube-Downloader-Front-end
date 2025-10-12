"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { JobStatusBadge } from "@/components/job-status-badge";
import type { Job } from "@/lib/types";
import Image from "next/image";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const handleDownload = () => {
    if (job.downloadUrl) {
      window.open(job.downloadUrl, "_blank");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card
      className={`py-0 overflow-hidden ${job.isPending ? "opacity-80" : ""}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 p-3 sm:p-4">
        {/* Thumbnail */}
        {job.thumbnailUrl && (
          <div className="relative w-full aspect-video sm:w-36 sm:aspect-video sm:flex-shrink-0 rounded overflow-hidden bg-muted">
            <Image
              src={job.thumbnailUrl || "/placeholder.svg"}
              alt={job.videoTitle || "Video thumbnail"}
              fill
              className={`object-cover ${job.isPending ? "opacity-70" : ""}`}
            />
            {job.isPending && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="text-xs text-white font-medium px-2 py-1 bg-black/40 rounded">
                  Connecting...
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2 mt-3 sm:mt-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm sm:text-base leading-tight line-clamp-2">
                {job.videoTitle || `Video ${job.videoId}`}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {job.format.toUpperCase()} • {formatDate(job.createdAt)}
              </p>
            </div>
            <JobStatusBadge status={job.status} />
          </div>

          {/* Error */}
          {job.status === "FAILED" && job.error && (
            <p className="text-xs sm:text-sm text-destructive bg-destructive/10 p-2 rounded">
              {job.error}
            </p>
          )}

          {/* Actions */}
          {job.status === "COMPLETED" && job.downloadUrl && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleDownload}
                size="sm"
                className="gap-2 text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" /> Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${job.videoId}`,
                    "_blank"
                  )
                }
                className="gap-2 text-xs sm:text-sm"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" /> View Original
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
