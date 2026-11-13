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
} from "@/styles/aria-nova/ui/combobox"

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
      aria-label="Frameworks"
      selectionMode="multiple"
      defaultValue={[frameworks[0]]}
      allowsEmptyCollection
      className="w-[250px] max-w-full"
    >
      <ComboboxChips>
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
