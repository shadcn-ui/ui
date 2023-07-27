"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Label } from "@/registry/new-york/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
import { Style, styles } from "@/registry/styles"
import { themes } from "@/registry/themes"

export function ThemeToolbar() {
  const [config, setConfig] = useConfig()

  return (
    <div className="flex items-stretch space-x-4">
      <div className="space-y-2 rounded-lg border px-4 pb-3 pt-2">
        <Label htmlFor="style" className="text-xs">
          Style
        </Label>
        <Select
          value={config.style}
          onValueChange={(value: Style["name"]) =>
            setConfig({
              ...config,
              style: value,
            })
          }
        >
          <SelectTrigger id="style" className="w-[200px]">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {styles.map((style) => (
              <SelectItem
                key={style.name}
                value={style.name}
                className="text-xs"
              >
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 rounded-lg border px-4 pb-3 pt-2">
        <Label htmlFor="style" className="text-xs">
          Theme
        </Label>
        <div className="flex h-9 space-x-2">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() =>
                setConfig({
                  ...config,
                  theme: theme.name,
                })
              }
              className="flex items-center gap-2 text-xs"
              style={
                {
                  "--theme-primary": `hsl(${theme.cssVars.light.primary})`,
                } as React.CSSProperties
              }
            >
              <span
                className={cn(
                  "flex h-6 w-6 rounded-full bg-[--theme-primary]",
                  config.theme === theme.name &&
                    "ring-2 ring-primary/60 ring-offset-2"
                )}
              />
              <span className="sr-only">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
