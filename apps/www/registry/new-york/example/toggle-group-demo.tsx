import {
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
} from "@radix-ui/react-icons"

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <FontBoldIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <FontItalicIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <StrikethroughIcon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
