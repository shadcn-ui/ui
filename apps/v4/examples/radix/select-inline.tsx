import { Input } from "@/examples/radix/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/examples/radix/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"

export function SelectInline() {
  return (
    <div className="flex items-center gap-2">
      <Input placeholder="Search..." className="flex-1" />
      <Select>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <NativeSelect className="w-[140px]">
        <NativeSelectOption value="">Sort by</NativeSelectOption>
        <NativeSelectOption value="name">Name</NativeSelectOption>
        <NativeSelectOption value="date">Date</NativeSelectOption>
        <NativeSelectOption value="status">Status</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
