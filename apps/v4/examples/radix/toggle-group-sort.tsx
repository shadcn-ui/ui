import { ToggleGroup, ToggleGroupItem } from "@/examples/radix/ui/toggle-group"
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from "lucide-react"

export function ToggleGroupSort() {
  return (
    <ToggleGroup
      type="single"
      defaultValue="newest"
      variant="outline"
      size="sm"
    >
      <ToggleGroupItem value="newest" aria-label="Newest">
        <ArrowDownIcon />
        Newest
      </ToggleGroupItem>
      <ToggleGroupItem value="oldest" aria-label="Oldest">
        <ArrowUpIcon />
        Oldest
      </ToggleGroupItem>
      <ToggleGroupItem value="popular" aria-label="Popular">
        <TrendingUpIcon />
        Popular
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
