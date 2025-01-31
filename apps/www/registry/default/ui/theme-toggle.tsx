"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/registry/default/ui/button"

interface ThemeToggleProps {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  icons?: { light: React.ReactNode; dark: React.ReactNode }
}

export function ThemeToggle({
  variant = "outline",
  size = "default",
  icons = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
  },
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? icons.light : icons.dark}
    </Button>
  )
}
