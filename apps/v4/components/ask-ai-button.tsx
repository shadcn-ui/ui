"use client"

import { SparklesIcon } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"

export default function AskAIButton() {
  const handleClick = () => {
    window.SiteAssist?.("toggle")
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-8 shadow-none"
      onClick={handleClick}
    >
      <SparklesIcon />
      Ask AI
    </Button>
  )
}
