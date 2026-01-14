import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui/select"
import { ChartBarIcon, ChartLineIcon, ChartPieIcon } from "lucide-react"

export function SelectWithIcons() {
  return (
    <div className="flex flex-col gap-4">
      <Select>
        <SelectTrigger size="sm">
          <SelectValue
            placeholder={
              <>
                <ChartLineIcon />
                Chart Type
              </>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="line">
              <ChartLineIcon />
              Line
            </SelectItem>
            <SelectItem value="bar">
              <ChartBarIcon />
              Bar
            </SelectItem>
            <SelectItem value="pie">
              <ChartPieIcon />
              Pie
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger size="default">
          <SelectValue
            placeholder={
              <>
                <ChartLineIcon />
                Chart Type
              </>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="line">
              <ChartLineIcon />
              Line
            </SelectItem>
            <SelectItem value="bar">
              <ChartBarIcon />
              Bar
            </SelectItem>
            <SelectItem value="pie">
              <ChartPieIcon />
              Pie
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
