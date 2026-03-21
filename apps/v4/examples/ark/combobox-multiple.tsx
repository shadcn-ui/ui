"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxList,
  ComboboxTrigger,
  useFilter,
  useListCollection,
} from "@/examples/ark/ui/combobox"

const frameworkItems = [
  { label: "Next.js", value: "nextjs" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Nuxt.js", value: "nuxtjs" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
]

export function ComboboxMultiple() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: frameworkItems,
    filter: contains,
  })

  return (
    <Combobox
      collection={collection}
      onInputValueChange={(details) => filter(details.inputValue)}
      multiple
      defaultValue={["nextjs"]}
    >
      <ComboboxControl>
        <ComboboxInput placeholder="Select frameworks" />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxList>
          {collection.items.map((item) => (
            <ComboboxItem key={item.value} item={item}>
              <ComboboxItemText>{item.label}</ComboboxItemText>
              <ComboboxItemIndicator />
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
