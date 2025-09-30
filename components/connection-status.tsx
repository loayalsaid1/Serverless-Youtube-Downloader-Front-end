"use client"

import { Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ConnectionStatusProps {
  isConnected: boolean
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <Badge variant={isConnected ? "default" : "destructive"} className="gap-1.5">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Disconnected</span>
        </>
      )}
    </Badge>
  )
}
