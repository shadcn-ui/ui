"use client"

import * as React from "react"
import { Sun, Moon, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

import {
  ToggleGroup,
  ToggleGroupItem
} from "@/registry/new-york/ui/toggle-group"

export default function ModeToggleGroup() {
  const { setTheme, theme } = useTheme()

  return (
    <ToggleGroup type="single" className="rounded-full border p-1">
      <ToggleGroupItem
        value="Light"
        disabled={theme === "light"}
        onClick={() => setTheme("light")}
        className="rounded-full disabled:opacity-100"
      >
        <Sun className="h-5 w-5" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="System"
        disabled={theme === "system"}
        onClick={() => setTheme("system")}
        className="rounded-full disabled:opacity-100"
      >
        <Laptop className="h-5 w-5" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="Dark"
        disabled={theme === "dark"}
        onClick={() => setTheme("dark")}
        className="rounded-full disabled:opacity-100"
      >
        <Moon className="h-5 w-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
