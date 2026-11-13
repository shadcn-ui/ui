"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
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

export default function ComboboxBasic() {
  return (
    <Combobox allowsEmptyCollection aria-label="Framework">
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxList
          renderEmptyState={() => (
            <ComboboxEmpty>No items found.</ComboboxEmpty>
          )}
        >
          {frameworks.map((item) => (
            <ComboboxItem key={item} id={item}>
              {item}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
