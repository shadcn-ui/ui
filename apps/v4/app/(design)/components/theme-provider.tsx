"use client"

import { cn } from "@/lib/utils"
import {
  useDesignSystemParam,
  useDesignSystemReady,
} from "@/app/(design)/hooks/use-design-system-sync"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useDesignSystemParam("theme")
  const isReady = useDesignSystemReady()

  // In iframe context, wait for first postMessage before rendering.
  if (!isReady) {
    return null
  }

  return (
    <div className={cn(`theme-${theme}`)}>
      <div className="theme-container bg-background">{children}</div>
    </div>
  )
}
