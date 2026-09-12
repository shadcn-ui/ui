import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/ark-nova/ui/input-group"
import { Kbd } from "@/styles/ark-nova/ui/kbd"
import { SearchIcon } from "lucide-react"

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
