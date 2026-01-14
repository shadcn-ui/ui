import { Input } from "@/examples/base/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/examples/base/ui/toggle-group"

export function ToggleGroupWithInputAndSelect() {
  const items = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Archived", value: "archived" },
  ]
  return (
    <div className="flex items-center gap-2">
      <Input type="search" placeholder="Search..." className="flex-1" />
      <Select items={items} defaultValue={items[0]}>
        <SelectTrigger className="w-32">
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
      <ToggleGroup defaultValue={["grid"]} variant="outline">
        <ToggleGroupItem value="grid" aria-label="Grid view">
          Grid
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
          List
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
