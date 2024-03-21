"use client"

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/registry/new-york/ui/multi-select"

export default function MultiSelectLimitCountDemo() {
  return (
    <MultiSelect defaultValue={["react", "next", "remix"]} maxCount={3}>
      <MultiSelectTrigger className="w-96">
        <MultiSelectValue placeholder="Select stack" />
      </MultiSelectTrigger>
      <MultiSelectContent>
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
      </MultiSelectContent>
    </MultiSelect>
  )
}
