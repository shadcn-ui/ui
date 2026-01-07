import { Bold, Italic, Underline } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/base-nova/ui/toggle-group"

export function ToggleGroupSingle() {
  return (
    <ToggleGroup toggleMultiple={false}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
