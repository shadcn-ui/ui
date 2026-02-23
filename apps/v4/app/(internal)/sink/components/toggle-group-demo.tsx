import {
  BoldIcon,
  BookmarkIcon,
  HeartIcon,
  ItalicIcon,
  StarIcon,
  UnderlineIcon,
} from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york-v4/ui/toggle-group"

export function ToggleGroupDemo() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <ToggleGroup type="multiple" spacing={2}>
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

      <ToggleGroup type="single" size="sm" defaultValue="last-24-hours">
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
      <ToggleGroup type="single" size="sm" defaultValue="top" variant="outline">
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        type="single"
        size="sm"
        defaultValue="top"
        variant="outline"
        spacing={2}
      >
        <ToggleGroupItem value="top" aria-label="Toggle top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem value="bottom" aria-label="Toggle bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem value="left" aria-label="Toggle left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Toggle right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup type="multiple" variant="outline" spacing={2} size="sm">
        <ToggleGroupItem
          value="star"
          aria-label="Toggle star"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500"
        >
          <StarIcon />
          Star
        </ToggleGroupItem>
        <ToggleGroupItem
          value="heart"
          aria-label="Toggle heart"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
        >
          <HeartIcon />
          Heart
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bookmark"
          aria-label="Toggle bookmark"
          className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
        >
          <BookmarkIcon />
          Bookmark
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
