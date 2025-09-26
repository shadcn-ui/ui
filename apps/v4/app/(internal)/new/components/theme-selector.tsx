"use client"

import { useThemeConfig } from "@/components/active-theme"
import { Field, FieldLabel } from "@/registry/new-york-v4/ui/field"
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

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig()

  return (
    <Field className="flex-1">
      <FieldLabel htmlFor="theme-selector" className="sr-only">
        Theme
      </FieldLabel>
      <Select value={activeTheme} onValueChange={setActiveTheme}>
        <SelectTrigger id="theme-selector" size="sm">
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
    </Field>
  )
}
