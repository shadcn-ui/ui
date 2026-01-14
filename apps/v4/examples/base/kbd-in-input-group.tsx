import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/base/ui/input-group"
import { Kbd } from "@/examples/base/ui/kbd"

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
