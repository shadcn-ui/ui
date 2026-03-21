"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/examples/react-aria/ui/combobox"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

export function ComboboxAutoHighlight() {
  return (
    <Combobox allowsEmptyCollection>
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>

        <ComboboxList renderEmptyState={() => <ComboboxEmpty>No items found.</ComboboxEmpty>}>
          {frameworks.map((item) => (
            <ComboboxItem key={item} id={item}>
              {item}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
