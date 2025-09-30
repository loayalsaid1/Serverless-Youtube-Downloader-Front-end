"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Check, AlertCircle } from "lucide-react"
import { isValidYouTubeUrl } from "@/lib/validators"

interface UrlInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function UrlInput({ value, onChange, onSubmit, disabled }: UrlInputProps) {
  const [validationState, setValidationState] = useState<"idle" | "valid" | "invalid">("idle")

  useEffect(() => {
    if (!value.trim()) {
      setValidationState("idle")
      return
    }

    const isValid = isValidYouTubeUrl(value)
    setValidationState(isValid ? "valid" : "invalid")
  }, [value])

  const handleClear = () => {
    onChange("")
    setValidationState("idle")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && validationState === "valid" && !disabled) {
      onSubmit()
    }
  }

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Paste YouTube URL here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="h-14 pr-20 text-base"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            disabled={disabled}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear input</span>
          </Button>
        )}
        {validationState === "valid" && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        )}
        {validationState === "invalid" && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
        )}
      </div>
    </div>
  )
}
