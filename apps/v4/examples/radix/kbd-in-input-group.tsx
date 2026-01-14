import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/radix/ui/input-group"
import { Kbd } from "@/examples/radix/ui/kbd"

export function KbdInInputGroup() {
  return (
    <InputGroup>
      <InputGroupInput />
      <InputGroupAddon>
        <Kbd>Space</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}
