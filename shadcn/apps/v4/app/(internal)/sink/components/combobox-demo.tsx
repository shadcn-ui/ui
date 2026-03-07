"use client"

import * as React from "react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "@/registry/new-york-v4/ui/combobox"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const timezones = [
  {
    value: "Americas",
    items: ["(GMT-5) New York", "(GMT-8) Los Angeles", "(GMT-6) Chicago"],
  },
  {
    value: "Europe",
    items: ["(GMT+0) London", "(GMT+1) Paris", "(GMT+1) Berlin"],
  },
  {
    value: "Asia/Pacific",
    items: ["(GMT+9) Tokyo", "(GMT+8) Shanghai", "(GMT+8) Singapore"],
  },
] as const

const countries = [
  { code: "", value: "", label: "Select country" },
  { code: "us", value: "united-states", label: "United States" },
  { code: "ca", value: "canada", label: "Canada" },
  { code: "gb", value: "united-kingdom", label: "United Kingdom" },
  { code: "de", value: "germany", label: "Germany" },
  { code: "fr", value: "france", label: "France" },
  { code: "jp", value: "japan", label: "Japan" },
]

export function ComboboxDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Basic combobox. */}
      <div className="flex flex-wrap items-start gap-4">
        <Combobox items={frameworks}>
          <ComboboxInput placeholder="Select a framework" />
          <ComboboxContent>
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
      </div>
      {/* With clear button. */}
      <div className="flex flex-wrap items-start gap-4">
        <Combobox items={frameworks} defaultValue={frameworks[0]}>
          <ComboboxInput placeholder="Select a framework" showClear />
          <ComboboxContent>
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
      </div>
      {/* With groups. */}
      <div className="flex flex-wrap items-start gap-4">
        <Combobox items={timezones}>
          <ComboboxInput placeholder="Select a timezone" />
          <ComboboxContent>
            <ComboboxEmpty>No timezones found.</ComboboxEmpty>
            <ComboboxList>
              {(group) => (
                <ComboboxGroup key={group.value} items={group.items}>
                  <ComboboxLabel>{group.value}</ComboboxLabel>
                  <ComboboxCollection>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      {/* With trigger button. */}
      <div className="flex flex-wrap items-start gap-4">
        <Combobox items={countries} defaultValue={countries[0]}>
          <ComboboxTrigger
            render={
              <Button
                variant="outline"
                className="w-64 justify-between font-normal"
              />
            }
          >
            <ComboboxValue />
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxInput showTrigger={false} placeholder="Search" />
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.code} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      {/* Multiple selection with chips. */}
      <ComboboxMultiple />
    </div>
  )
}

function ComboboxMultiple() {
  const anchor = useComboboxAnchor()

  return (
    <div className="flex flex-wrap items-start gap-4">
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        defaultValue={[frameworks[0]]}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values) => (
              <React.Fragment>
                {values.map((value: string) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder="Add framework..." />
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
    </div>
  )
}
