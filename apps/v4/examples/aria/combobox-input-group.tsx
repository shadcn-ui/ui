"use client"

import { GlobeIcon } from "lucide-react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/styles/aria-nova/ui/combobox"
import { InputGroupAddon } from "@/styles/aria-nova/ui/input-group"

const timezones = [
  {
    value: "Americas",
    items: [
      "(GMT-5) New York",
      "(GMT-8) Los Angeles",
      "(GMT-6) Chicago",
      "(GMT-5) Toronto",
      "(GMT-8) Vancouver",
      "(GMT-3) São Paulo",
    ],
  },
  {
    value: "Europe",
    items: [
      "(GMT+0) London",
      "(GMT+1) Paris",
      "(GMT+1) Berlin",
      "(GMT+1) Rome",
      "(GMT+1) Madrid",
      "(GMT+1) Amsterdam",
    ],
  },
  {
    value: "Asia/Pacific",
    items: [
      "(GMT+9) Tokyo",
      "(GMT+8) Shanghai",
      "(GMT+8) Singapore",
      "(GMT+4) Dubai",
      "(GMT+11) Sydney",
      "(GMT+9) Seoul",
    ],
  },
] as const

export function ComboxboxInputGroup() {
  return (
    <Combobox allowsEmptyCollection aria-label="Timezone">
      <ComboboxInput placeholder="Select a timezone">
        <InputGroupAddon>
          <GlobeIcon />
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent crossOffset={-28} className="w-60">
        <ComboboxList
          items={timezones}
          renderEmptyState={() => (
            <ComboboxEmpty>No timezones found.</ComboboxEmpty>
          )}
        >
          {(group) => (
            <ComboboxGroup id={group.value}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              {group.items.map((item) => (
                <ComboboxItem key={item} id={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
