import * as React from "react"
import {
  ChartBarIcon,
  ChartLineIcon,
  ChartPieIcon,
  CircleDashed,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

export function SelectDemo() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes" disabled>
              Grapes
            </SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Large List" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 100 }).map((_, i) => (
            <SelectItem key={i} value={`item-${i}`}>
              Item {i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select disabled>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes" disabled>
            Grapes
          </SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue
            placeholder={
              <>
                <CircleDashed className="text-muted-foreground" />
                With Icon
              </>
            }
          />
        </SelectTrigger>
        <SelectContent>
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
        </SelectContent>
      </Select>
    </div>
  )
}
