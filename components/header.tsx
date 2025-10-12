import { Download } from "lucide-react"
import { SettingsDropdown } from "@/components/settings-dropdown"
import { ConnectionStatus } from "@/components/connection-status"

interface HeaderProps {
  isConnected: boolean
}

export function Header({ isConnected }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary text-primary-foreground">
            <Download className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">YouTube Downloader</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ConnectionStatus isConnected={isConnected} />
          <SettingsDropdown />
        </div>
      </div>
    </header>
  )
}
