"use client"

import { cn } from "@/lib/utils"
import { useThemeConfig } from "@/components/active-theme"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

const THEMES = {
  sizes: [
    {
      name: "Default",
      value: "default",
    },
    {
      name: "Scaled",
      value: "scaled",
    },
    {
      name: "Mono",
      value: "mono",
    },
  ],
  colors: [
    {
      name: "Blue",
      value: "blue",
    },
    {
      name: "Green",
      value: "green",
    },
    {
      name: "Amber",
      value: "amber",
    },
    {
      name: "Rose",
      value: "rose",
    },
    {
      name: "Purple",
      value: "purple",
    },
    {
      name: "Orange",
      value: "orange",
    },
    {
      name: "Teal",
      value: "teal",
    },
  ],
  fonts: [
    {
      name: "Inter",
      value: "inter",
    },
    {
      name: "Noto Sans",
      value: "noto-sans",
    },
    {
      name: "Nunito Sans",
      value: "nunito-sans",
    },
    {
      name: "Figtree",
      value: "figtree",
    },
  ],
  radius: [
    {
      name: "None",
      value: "rounded-none",
    },
    {
      name: "Small",
      value: "rounded-small",
    },
    {
      name: "Medium",
      value: "rounded-medium",
    },
    {
      name: "Large",
      value: "rounded-large",
    },
    {
      name: "Full",
      value: "rounded-full",
    },
  ],
}

export function ThemeSelector({ className }: React.ComponentProps<"div">) {
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Label htmlFor="theme-selector" className="sr-only">
        Theme
      </Label>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger
          id="theme-selector"
          size="sm"
          className="bg-secondary text-secondary-foreground border-secondary justify-start shadow-none *:data-[slot=select-value]:w-16"
        >
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent align="end">
          {Object.entries(THEMES).map(
            ([key, themes], index) =>
              themes.length > 0 && (
                <div key={key}>
                  {index > 0 && <SelectSeparator />}
                  <SelectGroup>
                    <SelectLabel>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </SelectLabel>
                    {themes.map((theme) => (
                      <SelectItem
                        key={theme.name}
                        value={theme.value}
                        className="data-[state=checked]:opacity-50"
                      >
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </div>
              )
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
