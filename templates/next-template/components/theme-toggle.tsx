"use client";

import * as React from "react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted)
    return (
      <Button variant="ghost" size="sm">
        <Icons.loadingSpinner className="h-6 w-6 animate-spin hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100" />
      </Button>
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          {theme === "dark" ? (
            <Icons.moon className="hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100" />
          ) : theme === "light" ? (
            <Icons.sun className="hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100" />
          ) : (
            <Icons.laptop className="hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Icons.sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Icons.moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Icons.laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
