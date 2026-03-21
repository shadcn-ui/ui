import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/examples/react-aria/ui/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

export function ToggleGroupDisabled() {
  return (
    <ToggleGroup isDisabled>
      <ToggleGroupItem id="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem id="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem id="strikethrough" aria-label="Toggle strikethrough">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
