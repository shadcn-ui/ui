"use client"

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/registry/default/ui/multi-select"

export default function MultiSelectFilterDemo() {
  return (
    <MultiSelect>
      <MultiSelectTrigger className="w-96">
        <MultiSelectValue placeholder="Select stack" />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectSearch placeholder="Input to search" />
        <MultiSelectList>
          <MultiSelectGroup heading="React">
            <MultiSelectItem value="react">React</MultiSelectItem>
            <MultiSelectItem value="next">Next.js</MultiSelectItem>
            <MultiSelectItem value="remix">Remix</MultiSelectItem>
          </MultiSelectGroup>
          <MultiSelectGroup heading="Vue">
            <MultiSelectItem value="vue">Vue</MultiSelectItem>
            <MultiSelectItem value="nuxt">Nuxt</MultiSelectItem>
          </MultiSelectGroup>
          <MultiSelectGroup heading="Others">
            <MultiSelectItem value="angular">Angular</MultiSelectItem>
            <MultiSelectItem value="svelte">Svelte</MultiSelectItem>
          </MultiSelectGroup>
        </MultiSelectList>
        <MultiSelectEmpty />
      </MultiSelectContent>
    </MultiSelect>
  )
}
