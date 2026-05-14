import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/ark/ui/input-group"
import { Kbd } from "@/examples/ark/ui/kbd"
import { SearchIcon } from "lucide-react"

export function InputGroupKbd() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}
