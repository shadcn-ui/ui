import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/examples/react-aria/ui/toggle-group"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

export function ToggleGroupVertical() {
  return (
    <ToggleGroup
      selectionMode="multiple"
      orientation="vertical"
      spacing={1}
      defaultSelectedKeys={["bold", "italic"]}
    >
      <ToggleGroupItem id="bold" aria-label="Toggle bold">
        <BoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem id="italic" aria-label="Toggle italic">
        <ItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem id="underline" aria-label="Toggle underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
