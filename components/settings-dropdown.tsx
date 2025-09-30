"use client"

import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Settings, Moon, Sun, Monitor } from "lucide-react"
import { storageService } from "@/lib/storage"
import type { Settings as SettingsType, DownloadFormat } from "@/lib/types"
import { useTheme } from "next-themes"

export function SettingsDropdown() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState<SettingsType>(storageService.getSettings())

  useEffect(() => {
    const currentSettings = storageService.getSettings()
    setSettings(currentSettings)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    const updatedSettings = { ...settings, theme: newTheme as SettingsType["theme"] }
    setSettings(updatedSettings)
    storageService.saveSettings(updatedSettings)
  }

  const handleDefaultFormatChange = (format: string) => {
    const updatedSettings = { ...settings, defaultFormat: format as DownloadFormat }
    setSettings(updatedSettings)
    storageService.saveSettings(updatedSettings)
  }

  const handleNotificationsToggle = () => {
    const updatedSettings = { ...settings, notifications: !settings.notifications }
    setSettings(updatedSettings)
    storageService.saveSettings(updatedSettings)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
          <DropdownMenuRadioItem value="light" className="gap-2">
            <Sun className="h-4 w-4" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="gap-2">
            <Moon className="h-4 w-4" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="gap-2">
            <Monitor className="h-4 w-4" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Default Format</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={settings.defaultFormat} onValueChange={handleDefaultFormatChange}>
          <DropdownMenuRadioItem value="mp4">MP4 (Video)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="mp3">MP3 (Audio)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="txt">TXT (Transcript)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="srt">SRT (Subtitles)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleNotificationsToggle}>
          {settings.notifications ? "Disable" : "Enable"} Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
