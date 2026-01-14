import { Button } from "@/examples/radix/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/examples/radix/ui/button-group"
import { Input } from "@/examples/radix/ui/input"
import { Label } from "@/examples/radix/ui/label"

export function ButtonGroupWithText() {
  return (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <ButtonGroupText>Text</ButtonGroupText>
        <Button variant="outline">Another Button</Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText asChild>
          <Label htmlFor="input-text">GPU Size</Label>
        </ButtonGroupText>
        <Input id="input-text" placeholder="Type something here..." />
      </ButtonGroup>
    </div>
  )
}
