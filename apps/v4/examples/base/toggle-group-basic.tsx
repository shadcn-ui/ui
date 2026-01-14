import { ToggleGroup, ToggleGroupItem } from "@/examples/base/ui/toggle-group"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

export function ToggleGroupBasic() {
  return (
    <ToggleGroup multiple spacing={1}>
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
