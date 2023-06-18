import { AlignCenter, AlignLeft, AlignRight } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupMultiple() {
  return (
    <ToggleGroup
      defaultValue={["center", "left"]}
      aria-label="Text alignment"
      type="multiple"
    >
      <ToggleGroupItem value="left" aria-label="Left aligned">
        <AlignLeft size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned">
        <AlignCenter size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned">
        <AlignRight size={16} />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
