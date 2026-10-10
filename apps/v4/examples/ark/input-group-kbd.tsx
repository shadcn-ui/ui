import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/ark-nova/ui/input-group"
import { Kbd } from "@/styles/ark-nova/ui/kbd"
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
