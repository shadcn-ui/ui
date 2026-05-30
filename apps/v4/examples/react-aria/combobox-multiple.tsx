"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChipList,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@/styles/react-aria-nova/ui/combobox"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

export function ComboboxMultiple() {
  return (
    <Combobox
      selectionMode="multiple"
      defaultValue={[frameworks[0]]}
      allowsEmptyCollection
    >
      <ComboboxChips className="w-full max-w-xs">
        <ComboboxChipList<{ name: string }>>
          {(value) => <ComboboxChip id={value.name}>{value.name}</ComboboxChip>}
        </ComboboxChipList>
        <ComboboxChipsInput />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxList
          renderEmptyState={() => (
            <ComboboxEmpty>No items found.</ComboboxEmpty>
          )}
        >
          {frameworks.map((item) => (
            <ComboboxItem key={item} id={item} value={{ name: item }}>
              {item}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
