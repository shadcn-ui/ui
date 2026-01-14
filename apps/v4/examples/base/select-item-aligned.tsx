import { Item } from "@/examples/base/ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"

export function SelectItemAligned() {
  const items = [
    { label: "Select a fruit", value: null },
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Blueberry", value: "blueberry" },
    { label: "Grapes", value: "grapes", disabled: true },
    { label: "Pineapple", value: "pineapple" },
  ]
  return (
    <Select items={items}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={true}>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
