"use client"

import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
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
    { label: "Grapes", value: "grapes" },
    { label: "Pineapple", value: "pineapple" },
  ],
})

export function SelectDemo() {
  return (
    <Select collection={fruits}>
      <SelectControl className="w-full max-w-48">
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectIndicator />
      </SelectControl>
      <SelectContent>
        <SelectItemGroup>
          <SelectItemGroupLabel>Fruits</SelectItemGroupLabel>
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
