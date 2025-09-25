import { IconInfoCircle } from "@tabler/icons-react"

import {
  ButtonGroup,
  ButtonGroupText,
} from "@/registry/new-york-v4/ui/button-group"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
} from "@/registry/new-york-v4/ui/input-group"

export default function InputGroupButtonGroup() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <InputGroup>
          <Input id="url" />
          <InputGroupAddon align="inline-end">
            <IconInfoCircle />
          </InputGroupAddon>
        </InputGroup>
        <ButtonGroupText>.com</ButtonGroupText>
      </ButtonGroup>
    </div>
  )
}
