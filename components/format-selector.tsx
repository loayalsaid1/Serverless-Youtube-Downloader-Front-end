"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileVideo, Music, FileText, Subtitles } from "lucide-react"
import type { DownloadFormat } from "@/lib/types"

interface FormatSelectorProps {
  value: DownloadFormat
  onChange: (value: DownloadFormat) => void
  disabled?: boolean
}

const formats = [
  {
    value: "mp4" as const,
    label: "MP4",
    description: "Video",
    icon: FileVideo,
  },
  {
    value: "mp3" as const,
    label: "MP3",
    description: "Audio",
    icon: Music,
  },
  {
    value: "txt" as const,
    label: "TXT",
    description: "Transcript",
    icon: FileText,
  },
  {
    value: "srt" as const,
    label: "SRT",
    description: "Subtitles",
    icon: Subtitles,
  },
]

export function FormatSelector({ value, onChange, disabled }: FormatSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Format</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as DownloadFormat)}
        disabled={disabled}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {formats.map((format) => {
          const Icon = format.icon
          const isSelected = value === format.value

          return (
            <div key={format.value} className="relative">
              <RadioGroupItem value={format.value} id={format.value} className="peer sr-only" />
              <Label
                htmlFor={format.value}
                className={`
                  flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 cursor-pointer
                  transition-all duration-200
                  ${
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent"
                  }
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <div className="text-center">
                  <div className={`font-semibold ${isSelected ? "text-primary" : ""}`}>{format.label}</div>
                  <div className="text-xs text-muted-foreground">{format.description}</div>
                </div>
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}
