import { Button } from "@/examples/base/ui/button"
import { ButtonGroup } from "@/examples/base/ui/button-group"
import { Field } from "@/examples/base/ui/field"
import { Label } from "@/examples/base/ui/label"

export function ButtonGroupTextAlignment() {
  return (
    <Field>
      <Label id="alignment-label">Text Alignment</Label>
      <ButtonGroup aria-labelledby="alignment-label">
        <Button variant="outline" size="sm">
          Left
        </Button>
        <Button variant="outline" size="sm">
          Center
        </Button>
        <Button variant="outline" size="sm">
          Right
        </Button>
        <Button variant="outline" size="sm">
          Justify
        </Button>
      </ButtonGroup>
    </Field>
  )
}
