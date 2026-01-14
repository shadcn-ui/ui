import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"
import { ChartBarIcon, ChartLineIcon, ChartPieIcon } from "lucide-react"

export function SelectWithIcons() {
  const items = [
    {
      label: (
        <>
          <ChartLineIcon />
          Chart Type
        </>
      ),
      value: null,
    },
    {
      label: (
        <>
          <ChartLineIcon />
          Line
        </>
      ),
      value: "line",
    },
    {
      label: (
        <>
          <ChartBarIcon />
          Bar
        </>
      ),
      value: "bar",
    },
    {
      label: (
        <>
          <ChartPieIcon />
          Pie
        </>
      ),
      value: "pie",
    },
  ]
  return (
    <div className="flex flex-col gap-4">
      <Select items={items}>
        <SelectTrigger size="sm">
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
      <Select items={items}>
        <SelectTrigger size="default">
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
    </div>
  )
}
