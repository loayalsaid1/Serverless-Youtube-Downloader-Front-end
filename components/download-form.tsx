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
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-balance">Download YouTube Videos</h2>
        <p className="text-muted-foreground">Paste a YouTube URL and select your preferred format</p>
      </div>

      <div className="space-y-4">
        <UrlInput value={url} onChange={setUrl} onSubmit={handleSubmit} disabled={isSubmitting} />

        <FormatSelector value={format} onChange={setFormat} disabled={isSubmitting} />

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !url.trim()}
          className="w-full h-12 text-base"
          size="lg"
        >
          <Download className="mr-2 h-5 w-5" />
          {isSubmitting ? "Submitting..." : "Download"}
        </Button>
      </div>
    </Card>
  )
}
