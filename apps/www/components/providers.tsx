"use client"

import * as React from "react"
import { Provider as JotaiProvider } from "jotai"
import { ThemeProvider as NextThemesProvider } from "next-themes"

import { TooltipProvider } from "@/registry/new-york/ui/tooltip"

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <JotaiProvider>
      <NextThemesProvider {...props}>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </NextThemesProvider>
    </JotaiProvider>
  )
}
