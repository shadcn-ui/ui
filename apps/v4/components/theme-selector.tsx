"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { THEMES } from "@/lib/themes"
import { useThemeConfig } from "@/components/active-theme"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

export function ThemeSelector() {
  const { resolvedTheme } = useTheme()
  const { activeTheme, setActiveTheme } = useThemeConfig()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Select value={activeTheme} onValueChange={setActiveTheme}>
      <SelectTrigger size="sm">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent align="end">
        {THEMES.map((theme) => (
          <SelectItem key={theme.name} value={theme.value}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
