"use client"

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/registry/default/ui/multi-select"

export default function MultiSelectLimitDisplayLengthDemo() {
  return (
    <MultiSelect defaultValue={["long", "react", "angular", "vue", "remix"]}>
      <MultiSelectTrigger className="w-96">
        <MultiSelectValue
          placeholder="Select stack"
          maxDisplay={3}
          maxItemLength={5}
        />
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
            <MultiSelectItem value="long">VeryVeryLongItem</MultiSelectItem>
          </MultiSelectGroup>
        </MultiSelectList>
      </MultiSelectContent>
    </MultiSelect>
  )
}
