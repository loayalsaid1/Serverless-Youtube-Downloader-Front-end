import { toast } from "sonner"
import type { DownloadFormat } from "./types"

interface VideoToastData {
  videoTitle?: string
  thumbnailUrl?: string
  format?: DownloadFormat
  videoId?: string
}

const formatLabels: Record<DownloadFormat, string> = {
  mp4: "MP4 Video",
  mp3: "MP3 Audio", 
  txt: "TXT Transcript",
  srt: "SRT Subtitles"
}

export const enhancedToast = {
  success: (title: string, data?: VideoToastData) => {
    if (data?.videoTitle || data?.thumbnailUrl) {
      return toast(title, {
        description: (
          <div className="flex items-center gap-3 mt-2">
            {data.thumbnailUrl && (
              <img 
                src={data.thumbnailUrl} 
                alt="Video thumbnail"
                className="w-16 h-12 object-cover rounded flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            )}
            <div className="flex-1 min-w-0 max-w-[200px]">
              {data.videoTitle && (
                <p className="font-medium text-sm truncate mb-1">
                  {data.videoTitle}
                </p>
              )}
              {data.format && (
                <p className="text-xs text-muted-foreground">
                  {formatLabels[data.format]}
                </p>
              )}
            </div>
          </div>
        ),
      })
    } else {
      return toast.success(title, {
        description: data?.format ? `${formatLabels[data.format]} download` : undefined
      })
    }
  },

  error: (title: string, data?: VideoToastData & { error?: string }) => {
    if (data?.videoTitle || data?.thumbnailUrl) {
      return toast(title, {
        description: (
          <div className="flex items-center gap-3 mt-2">
            {data.thumbnailUrl && (
              <img 
                src={data.thumbnailUrl} 
                alt="Video thumbnail"
                className="w-16 h-12 object-cover rounded flex-shrink-0 opacity-70"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            )}
            <div className="flex-1 min-w-0 max-w-[100px]">
              {data.videoTitle && (
                <p className="font-medium text-sm truncate mb-1">
                  {data.videoTitle}
                </p>
              )}
              {data.format && (
                <p className="text-xs text-muted-foreground mb-1">
                  {formatLabels[data.format]}
                </p>
              )}
              {data.error && (
                <p className="text-xs text-red-400">
                  {data.error}
                </p>
              )}
            </div>
          </div>
        ),
      })
    } else {
      return toast.error(title, {
        description: data?.error || (data?.format ? `${formatLabels[data.format]} download failed` : undefined)
      })
    }
  },


}
