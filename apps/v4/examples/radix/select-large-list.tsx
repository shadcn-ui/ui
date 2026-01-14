import { Item } from "@/examples/radix/ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"

export function SelectLargeList() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select an item" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Array.from({ length: 100 }).map((_, i) => (
            <SelectItem key={i} value={`item-${i}`}>
              Item {i}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
