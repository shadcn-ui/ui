"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxContext,
  ComboboxItem,
  ComboboxItemText,
  ComboboxList,
  ComboboxTag,
  ComboboxTagsControl,
  ComboboxTagsInput,
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
      className="w-full max-w-xs"
    >
      <ComboboxContext>
        {(context) => (
          <ComboboxTagsControl>
            {context.selectedItems.map((item: { label: string; value: string }) => (
              <ComboboxTag
                key={item.value}
                value={item.value}
                onRemove={(value) => context.clearValue(value)}
              >
                {item.label}
              </ComboboxTag>
            ))}
            <ComboboxTagsInput placeholder="Select frameworks" />
            <ComboboxTrigger />
          </ComboboxTagsControl>
        )}
      </ComboboxContext>
      <ComboboxContent>
        <ComboboxList>
          {collection.items.map((item) => (
            <ComboboxItem key={item.value} item={item}>
              <ComboboxItemText>{item.label}</ComboboxItemText>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
