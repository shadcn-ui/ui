import {
  ButtonGroup,
  ButtonGroupText,
} from "@/examples/react-aria/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/examples/react-aria/ui/input-group"
import { Label } from "@/examples/react-aria/ui/label"
import { Link2Icon } from "lucide-react"

export default function InputGroupButtonGroup() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <ButtonGroup>
        <ButtonGroupText render={props => <Label {...props} htmlFor="url" />}>
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
