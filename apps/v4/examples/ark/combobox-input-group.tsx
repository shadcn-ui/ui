"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxItemText,
  ComboboxList,
  ComboboxClearTrigger,
  ComboboxTrigger,
  useFilter,
  useListCollection,
} from "@/examples/ark/ui/combobox"
import { GlobeIcon } from "lucide-react"

const americasItems = [
  { label: "(GMT-5) New York", value: "gmt-5-new-york" },
  { label: "(GMT-8) Los Angeles", value: "gmt-8-los-angeles" },
  { label: "(GMT-6) Chicago", value: "gmt-6-chicago" },
  { label: "(GMT-5) Toronto", value: "gmt-5-toronto" },
  { label: "(GMT-8) Vancouver", value: "gmt-8-vancouver" },
  { label: "(GMT-3) Sao Paulo", value: "gmt-3-sao-paulo" },
]

const europeItems = [
  { label: "(GMT+0) London", value: "gmt-0-london" },
  { label: "(GMT+1) Paris", value: "gmt-1-paris" },
  { label: "(GMT+1) Berlin", value: "gmt-1-berlin" },
  { label: "(GMT+1) Rome", value: "gmt-1-rome" },
  { label: "(GMT+1) Madrid", value: "gmt-1-madrid" },
  { label: "(GMT+1) Amsterdam", value: "gmt-1-amsterdam" },
]

const asiaPacificItems = [
  { label: "(GMT+9) Tokyo", value: "gmt-9-tokyo" },
  { label: "(GMT+8) Shanghai", value: "gmt-8-shanghai" },
  { label: "(GMT+8) Singapore", value: "gmt-8-singapore" },
  { label: "(GMT+4) Dubai", value: "gmt-4-dubai" },
  { label: "(GMT+11) Sydney", value: "gmt-11-sydney" },
  { label: "(GMT+9) Seoul", value: "gmt-9-seoul" },
]

const allTimezoneItems = [...americasItems, ...europeItems, ...asiaPacificItems]

const americasValues = new Set(americasItems.map((i) => i.value))
const europeValues = new Set(europeItems.map((i) => i.value))
const asiaPacificValues = new Set(asiaPacificItems.map((i) => i.value))

export function ComboxboxInputGroup() {
  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter } = useListCollection({
    initialItems: allTimezoneItems,
    filter: contains,
  })

  const filteredAmericas = collection.items.filter((item) =>
    americasValues.has(item.value)
  )
  const filteredEurope = collection.items.filter((item) =>
    europeValues.has(item.value)
  )
  const filteredAsiaPacific = collection.items.filter((item) =>
    asiaPacificValues.has(item.value)
  )

  return (
    <Combobox
      collection={collection}
      onInputValueChange={(details) => filter(details.inputValue)}
      className="w-full max-w-64"
    >
      <ComboboxControl>
        <GlobeIcon className="ms-2.5 size-4 shrink-0 text-muted-foreground" />
        <ComboboxInput placeholder="Select a timezone" className="ps-1.5" />
        <ComboboxClearTrigger />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxList>
          {filteredAmericas.length > 0 && (
            <ComboboxItemGroup>
              <ComboboxItemGroupLabel>Americas</ComboboxItemGroupLabel>
              {filteredAmericas.map((item) => (
                <ComboboxItem key={item.value} item={item}>
                  <ComboboxItemText>{item.label}</ComboboxItemText>
                </ComboboxItem>
              ))}
            </ComboboxItemGroup>
          )}
          {filteredEurope.length > 0 && (
            <ComboboxItemGroup>
              <ComboboxItemGroupLabel>Europe</ComboboxItemGroupLabel>
              {filteredEurope.map((item) => (
                <ComboboxItem key={item.value} item={item}>
                  <ComboboxItemText>{item.label}</ComboboxItemText>
                </ComboboxItem>
              ))}
            </ComboboxItemGroup>
          )}
          {filteredAsiaPacific.length > 0 && (
            <ComboboxItemGroup>
              <ComboboxItemGroupLabel>Asia/Pacific</ComboboxItemGroupLabel>
              {filteredAsiaPacific.map((item) => (
                <ComboboxItem key={item.value} item={item}>
                  <ComboboxItemText>{item.label}</ComboboxItemText>
                </ComboboxItem>
              ))}
            </ComboboxItemGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
