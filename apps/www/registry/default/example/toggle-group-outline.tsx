import { Bold, Italic, Strikethrough } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup variant={"outline"} type="multiple">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <Strikethrough className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
