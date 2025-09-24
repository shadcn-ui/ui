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
  default: [
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
  fonts: [],
  sizes: [],
  radius: [],
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
          <span className="font-medium">Theme:</span>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent align="end">
          {THEMES.default.length > 0 && (
            <SelectGroup>
              {THEMES.default.map((theme) => (
                <SelectItem
                  key={theme.name}
                  value={theme.value}
                  className="data-[state=checked]:opacity-50"
                >
                  {theme.name}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {THEMES.colors.length > 0 && (
            <>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Colors</SelectLabel>
                {THEMES.colors.map((theme) => (
                  <SelectItem
                    key={theme.name}
                    value={theme.value}
                    className="data-[state=checked]:opacity-50"
                  >
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          )}
          {THEMES.fonts.length > 0 && (
            <>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Fonts</SelectLabel>
                {THEMES.fonts.map((theme) => (
                  <SelectItem
                    key={theme.name}
                    value={theme.value}
                    className="data-[state=checked]:opacity-50"
                  >
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          )}
          {THEMES.sizes.length > 0 && (
            <>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Sizes</SelectLabel>
                {THEMES.sizes.map((theme) => (
                  <SelectItem
                    key={theme.name}
                    value={theme.value}
                    className="data-[state=checked]:opacity-50"
                  >
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          )}
          {THEMES.radius.length > 0 && (
            <>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Radius</SelectLabel>
                {THEMES.radius.map((theme) => (
                  <SelectItem
                    key={theme.name}
                    value={theme.value}
                    className="data-[state=checked]:opacity-50"
                  >
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
