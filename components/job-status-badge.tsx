import { Badge } from "@/components/ui/badge"
import { Clock, Loader2, CheckCircle2, XCircle } from "lucide-react"
import type { JobStatus } from "@/lib/types"

interface JobStatusBadgeProps {
  status: JobStatus
}

const statusConfig = {
  QUEUED: {
    label: "Queued",
    variant: "secondary" as const,
    icon: Clock,
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  PROCESSING: {
    label: "Processing",
    variant: "secondary" as const,
    icon: Loader2,
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  COMPLETED: {
    label: "Completed",
    variant: "secondary" as const,
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  FAILED: {
    label: "Failed",
    variant: "destructive" as const,
    icon: XCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`gap-1.5 ${config.className}`}>
      <Icon className={`h-3 w-3 ${status === "PROCESSING" ? "animate-spin" : ""}`} />
      <span>{config.label}</span>
    </Badge>
  )
}
