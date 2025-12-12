"use client"

import * as React from "react"

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectLabel,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/registry/new-york-v4/ui/multi-select"

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

export default function MultiSelectDemo() {
  const [values, setValues] = React.useState<string[]>(["next.js"])

  return (
    <MultiSelect value={values} onValueChange={setValues}>
      <MultiSelectTrigger className="w-[260px] justify-between">
        <MultiSelectValue
          placeholder="Select frameworks"
          options={frameworks}
          maxBadges={2}
        />
      </MultiSelectTrigger>
      <MultiSelectContent searchPlaceholder="Search framework...">
        <MultiSelectGroup>
          <MultiSelectLabel>Frameworks</MultiSelectLabel>
          {frameworks.map((framework) => (
            <MultiSelectItem
              key={framework.value}
              value={framework.value}
              label={framework.label}
            />
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  )
}
