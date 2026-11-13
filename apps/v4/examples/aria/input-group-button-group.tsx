import { Link2Icon } from "lucide-react"

import {
  ButtonGroup,
  ButtonGroupText,
} from "@/styles/aria-nova/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/styles/aria-nova/ui/input-group"
import { Label } from "@/styles/aria-nova/ui/label"

export default function InputGroupButtonGroup() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <ButtonGroup>
        <ButtonGroupText render={(props) => <Label {...props} htmlFor="url" />}>
          https://
        </ButtonGroupText>
        <InputGroup>
          <InputGroupInput id="url" />
          <InputGroupAddon align="inline-end">
            <Link2Icon />
          </InputGroupAddon>
        </InputGroup>
        <ButtonGroupText>.com</ButtonGroupText>
      </ButtonGroup>
    </div>
  )
}
