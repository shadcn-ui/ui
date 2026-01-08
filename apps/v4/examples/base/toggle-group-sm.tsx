import { ToggleGroup, ToggleGroupItem } from "@/examples/base/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

export function ToggleGroupSm() {
  return (
    <ToggleGroup size="sm">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
