"use client"

import * as React from "react"
import { Provider as JotaiProvider } from "jotai"
const NextThemesProvider = dynamic(
	() => import('next-themes').then((e) => e.ThemeProvider),
	{
		ssr: false,
	}
)
import { ThemeProviderProps } from "next-themes/dist/types"


import { TooltipProvider } from "@/registry/new-york/ui/tooltip"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <JotaiProvider>
      <NextThemesProvider {...props}>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </NextThemesProvider>
    </JotaiProvider>
  )
}
