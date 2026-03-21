"use client"

import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/examples/ark/ui/select"

const fruits = createListCollection({
  items: [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes", disabled: true },
    { label: "Pineapple", value: "pineapple" },
  ],
})

export function SelectDisabled() {
  return (
    <Select collection={fruits} disabled>
      <SelectControl className="w-full max-w-48">
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectIndicator />
      </SelectControl>
      <SelectContent>
        <SelectItemGroup>
          {fruits.items.map((item) => (
            <SelectItem key={item.value} item={item}>
              <SelectItemText>{item.label}</SelectItemText>
              <SelectItemIndicator />
            </SelectItem>
          ))}
        </SelectItemGroup>
      </SelectContent>
    </Select>
  )
}
