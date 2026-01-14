import { ToggleGroup, ToggleGroupItem } from "@/examples/radix/ui/toggle-group"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

export function ToggleGroupVerticalOutlineWithIcons() {
  return (
    <ToggleGroup
      variant="outline"
      type="multiple"
      orientation="vertical"
      size="sm"
    >
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
