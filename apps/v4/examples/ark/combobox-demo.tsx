"use client"

import * as React from "react"
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
  createListCollection,
} from "@/examples/ark/ui/combobox"

const frameworkItems = [
  { label: "Next.js", value: "nextjs" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Nuxt.js", value: "nuxtjs" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
]

export default function ComboboxDemo() {
  const [items, setItems] = React.useState(frameworkItems)

  const collection = React.useMemo(
    () => createListCollection({ items }),
    [items]
  )

  const handleInputValueChange = (details: { inputValue: string }) => {
    const filtered = frameworkItems.filter((item) =>
      item.label.toLowerCase().includes(details.inputValue.toLowerCase())
    )
    setItems(filtered.length > 0 ? filtered : frameworkItems)
  }

  return (
    <Combobox
      collection={collection}
      onInputValueChange={handleInputValueChange}
    >
      <ComboboxControl>
        <ComboboxInput placeholder="Select a framework" />
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
