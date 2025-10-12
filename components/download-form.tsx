"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UrlInput } from "@/components/url-input"
import { FormatSelector } from "@/components/format-selector"
import { Download } from "lucide-react"
import { useDownloader } from "@/hooks/use-downloader"
import { storageService } from "@/lib/storage"
import type { DownloadFormat } from "@/lib/types"

interface DownloadFormProps {
  onJobSubmitted?: () => void
}

export function DownloadForm({ onJobSubmitted }: DownloadFormProps) {
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState<DownloadFormat>(() => {
    return storageService.getSettings().defaultFormat
  })

  const { submitDownload, isSubmitting } = useDownloader()

  const handleSubmit = async () => {
    const job = await submitDownload(url, format)
    if (job) {
      setUrl("")
      onJobSubmitted?.()
    }
  }

  return (
    <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-balance">Download YouTube Videos</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Paste a YouTube URL and select your preferred format</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <UrlInput value={url} onChange={setUrl} onSubmit={handleSubmit} disabled={isSubmitting} />

        <FormatSelector value={format} onChange={setFormat} disabled={isSubmitting} />

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !url.trim()}
          className="w-full h-11 sm:h-12 text-sm sm:text-base"
          size="lg"
        >
          <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {isSubmitting ? "Submitting..." : "Download"}
        </Button>
      </div>
    </Card>
  )
}
