import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/examples/base/ui/combobox"
import { Select } from "@/examples/base/ui/select"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const items = [
  {
    label: "Select a framework",
    value: null,
  },
  {
    label: "React",
    value: "react",
  },
  {
    label: "Vue",
    value: "vue",
  },
  {
    label: "Angular",
    value: "angular",
  },
  {
    label: "Svelte",
    value: "svelte",
  },
  {
    label: "Solid",
    value: "solid",
  },
  {
    label: "Preact",
    value: "preact",
  },
  {
    label: "Next.js",
    value: "next.js",
  },
]

export function ComboboxMultipleNoRemove() {
  const anchor = useComboboxAnchor()

  return (
    <Combobox
      multiple
      autoHighlight
      items={frameworks}
      defaultValue={[frameworks[0], frameworks[1]]}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip key={value} showRemove={false}>
                  {value}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
