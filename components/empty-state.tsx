import { Download } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Download className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No downloads yet</h3>
      <p className="text-muted-foreground max-w-sm">
        Paste a YouTube URL above and select your preferred format to get started
      </p>
    </div>
  )
}
