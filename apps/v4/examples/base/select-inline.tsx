import { Input } from "@/examples/base/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/examples/base/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"

export function SelectInline() {
  const items = [
    { label: "Filter", value: null },
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ]
  return (
    <div className="flex items-center gap-2">
      <Input placeholder="Search..." className="flex-1" />
      <Select items={items}>
        <SelectTrigger className="w-[140px]">
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
      <NativeSelect className="w-[140px]">
        <NativeSelectOption value="">Sort by</NativeSelectOption>
        <NativeSelectOption value="name">Name</NativeSelectOption>
        <NativeSelectOption value="date">Date</NativeSelectOption>
        <NativeSelectOption value="status">Status</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
