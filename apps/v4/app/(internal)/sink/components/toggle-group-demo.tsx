import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york-v4/ui/toggle-group"

export function ToggleGroupDemo() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="strikethrough"
          aria-label="Toggle strikethrough"
        >
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        variant="outline"
        type="single"
        defaultValue="all"
        className="*:data-[slot=toggle-group-item]:w-20"
      >
        <ToggleGroupItem value="all" aria-label="Toggle all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="missed" aria-label="Toggle missed">
          Missed
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        variant="outline"
        type="single"
        size="sm"
        defaultValue="last-24-hours"
        className="*:data-[slot=toggle-group-item]:px-3"
      >
        <ToggleGroupItem
          value="last-24-hours"
          aria-label="Toggle last 24 hours"
        >
          Last 24 hours
        </ToggleGroupItem>
        <ToggleGroupItem value="last-7-days" aria-label="Toggle last 7 days">
          Last 7 days
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        type="single"
        size="sm"
        defaultValue="last-24-hours"
        className="*:data-[slot=toggle-group-item]:px-3"
      >
        <ToggleGroupItem
          value="last-24-hours"
          aria-label="Toggle last 24 hours"
        >
          Last 24 hours
        </ToggleGroupItem>
        <ToggleGroupItem value="last-7-days" aria-label="Toggle last 7 days">
          Last 7 days
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
