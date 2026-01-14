import { Input } from "@/examples/radix/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/examples/radix/ui/toggle-group"

export function ToggleGroupWithInputAndSelect() {
  return (
    <div className="flex items-center gap-2">
      <Input type="search" placeholder="Search..." className="flex-1" />
      <Select defaultValue="all">
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <ToggleGroup type="single" defaultValue="grid" variant="outline">
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
