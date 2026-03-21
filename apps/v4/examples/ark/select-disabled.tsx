"use client"

import {
  createListCollection,
  Select,
  SelectContent,
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
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
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
