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
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/examples/ark/ui/item"

const countryItems = [
  { code: "ar", value: "argentina", label: "Argentina", continent: "South America" },
  { code: "au", value: "australia", label: "Australia", continent: "Oceania" },
  { code: "br", value: "brazil", label: "Brazil", continent: "South America" },
  { code: "ca", value: "canada", label: "Canada", continent: "North America" },
  { code: "cn", value: "china", label: "China", continent: "Asia" },
  { code: "co", value: "colombia", label: "Colombia", continent: "South America" },
  { code: "eg", value: "egypt", label: "Egypt", continent: "Africa" },
  { code: "fr", value: "france", label: "France", continent: "Europe" },
  { code: "de", value: "germany", label: "Germany", continent: "Europe" },
  { code: "it", value: "italy", label: "Italy", continent: "Europe" },
  { code: "jp", value: "japan", label: "Japan", continent: "Asia" },
  { code: "ke", value: "kenya", label: "Kenya", continent: "Africa" },
  { code: "mx", value: "mexico", label: "Mexico", continent: "North America" },
  { code: "nz", value: "new-zealand", label: "New Zealand", continent: "Oceania" },
  { code: "ng", value: "nigeria", label: "Nigeria", continent: "Africa" },
  { code: "za", value: "south-africa", label: "South Africa", continent: "Africa" },
  { code: "kr", value: "south-korea", label: "South Korea", continent: "Asia" },
  { code: "gb", value: "united-kingdom", label: "United Kingdom", continent: "Europe" },
  { code: "us", value: "united-states", label: "United States", continent: "North America" },
]

export function ComboboxWithCustomItems() {
  const [items, setItems] = React.useState(countryItems)

  const collection = React.useMemo(
    () => createListCollection({ items }),
    [items]
  )

  const handleInputValueChange = (details: { inputValue: string }) => {
    const filtered = countryItems.filter((item) =>
      item.label.toLowerCase().includes(details.inputValue.toLowerCase())
    )
    setItems(filtered.length > 0 ? filtered : countryItems)
  }

  return (
    <Combobox
      collection={collection}
      onInputValueChange={handleInputValueChange}
    >
      <ComboboxControl>
        <ComboboxInput placeholder="Search countries..." />
        <ComboboxTrigger />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxList>
          {collection.items.map((country) => (
            <ComboboxItem key={country.code} item={country}>
              <ComboboxItemText>
                <Item size="xs" className="p-0">
                  <ItemContent>
                    <ItemTitle className="whitespace-nowrap">
                      {country.label}
                    </ItemTitle>
                    <ItemDescription>
                      {country.continent} ({country.code})
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItemText>
              <ComboboxItemIndicator />
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
