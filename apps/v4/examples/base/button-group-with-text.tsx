import { Button } from "@/examples/base/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/examples/base/ui/button-group"
import { Input } from "@/examples/base/ui/input"
import { Label } from "@/examples/base/ui/label"

export function ButtonGroupWithText() {
  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <ButtonGroupText>Text</ButtonGroupText>
        <Button variant="outline">Another Button</Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText render={<Label htmlFor="input-text" />}>
          GPU Size
        </ButtonGroupText>
        <Input id="input-text" placeholder="Type something here..." />
      </ButtonGroup>
    </div>
  )
}
