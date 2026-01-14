import { Item } from "@/examples/base/ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"

export function SelectLargeList() {
  const items = [
    { label: "Select an item", value: null },
    ...Array.from({ length: 100 }).map((_, i) => ({
      label: `Item ${i}`,
      value: `item-${i}`,
    })),
  ]
  return (
    <Select items={items}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
