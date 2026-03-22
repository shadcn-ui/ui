"use client"

import { Portal } from "@ark-ui/react/portal"
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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/examples/ark/ui/select"

const collection = createListCollection({
  items: [
    { label: "Apple", value: "apple", type: "fruit" },
    { label: "Banana", value: "banana", type: "fruit" },
    { label: "Blueberry", value: "blueberry", type: "fruit" },
    { label: "Carrot", value: "carrot", type: "vegetable" },
    { label: "Broccoli", value: "broccoli", type: "vegetable" },
    { label: "Spinach", value: "spinach", type: "vegetable" },
  ],
  groupBy: (item) => item.type,
})

const groupLabels: Record<string, string> = {
  fruit: "Fruits",
  vegetable: "Vegetables",
}

export function SelectGroups() {
  return (
    <Select collection={collection}>
      <SelectControl className="w-full max-w-48">
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectIndicator />
      </SelectControl>
      <Portal>
        <SelectContent>
        {collection.group().map(([type, group], index) => (
          <SelectItemGroup key={type}>
            {index > 0 && <SelectSeparator />}
            <SelectItemGroupLabel>
              {groupLabels[type] ?? type}
            </SelectItemGroupLabel>
            {group.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
        ))}
      </SelectContent>
      </Portal>
    </Select>
  )
}
