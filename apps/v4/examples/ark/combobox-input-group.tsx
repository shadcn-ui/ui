"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemGroup,
  ComboboxItemGroupLabel,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxList,
  ComboboxTrigger,
  createListCollection,
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

export function ComboxboxInputGroup() {
  const [items, setItems] = React.useState(allTimezoneItems)

  const collection = React.useMemo(
    () => createListCollection({ items }),
    [items]
  )

  const handleInputValueChange = (details: { inputValue: string }) => {
    const filtered = allTimezoneItems.filter((item) =>
      item.label.toLowerCase().includes(details.inputValue.toLowerCase())
    )
    setItems(filtered.length > 0 ? filtered : allTimezoneItems)
  }

  const filteredAmericas = items.filter((item) =>
    americasItems.some((a) => a.value === item.value)
  )
  const filteredEurope = items.filter((item) =>
    europeItems.some((e) => e.value === item.value)
  )
  const filteredAsiaPacific = items.filter((item) =>
    asiaPacificItems.some((a) => a.value === item.value)
  )

  return (
    <Combobox
      collection={collection}
      onInputValueChange={handleInputValueChange}
    >
      <ComboboxControl>
        <GlobeIcon className="size-4" />
        <ComboboxInput placeholder="Select a timezone" />
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
                  <ComboboxItemIndicator />
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
                  <ComboboxItemIndicator />
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
                  <ComboboxItemIndicator />
                </ComboboxItem>
              ))}
            </ComboboxItemGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
