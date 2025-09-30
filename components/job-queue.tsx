"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { JobCard } from "@/components/job-card"
import type { Job } from "@/lib/types"

interface JobQueueProps {
  activeJobs: Job[]
  completedJobs: Job[]
  onClearCompleted: () => void
}

export function JobQueue({ activeJobs, completedJobs, onClearCompleted }: JobQueueProps) {
  const [isOpen, setIsOpen] = useState(true)

  const totalJobs = activeJobs.length + completedJobs.length

  if (totalJobs === 0) {
    return null
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              Downloads {activeJobs.length > 0 && `(${activeJobs.length} active)`}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {completedJobs.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onClearCompleted()
                }}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Completed
              </Button>
            )}
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-3">
            {/* Active Jobs */}
            {activeJobs.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Active</h3>
                {activeJobs.map((job) => (
                  <JobCard key={job.jobId} job={job} />
                ))}
              </div>
            )}

            {/* Completed Jobs */}
            {completedJobs.length > 0 && (
              <div className="space-y-2">
                {activeJobs.length > 0 && <div className="border-t pt-3" />}
                <h3 className="text-sm font-medium text-muted-foreground">Recent</h3>
                {completedJobs.slice(0, 5).map((job) => (
                  <JobCard key={job.jobId} job={job} />
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
