import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/radix-nova/ui/input-group"
import { Kbd } from "@/registry/radix-nova/ui/kbd"

export default function KbdInputGroup() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
