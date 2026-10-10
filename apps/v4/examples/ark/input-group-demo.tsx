import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/ark-nova/ui/input-group"
import { Search } from "lucide-react"

export function InputGroupDemo() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
    </InputGroup>
  )
}
