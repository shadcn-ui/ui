import {
  Checkbox,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
} from "@/examples/ark/ui/checkbox"
import { Label } from "@/examples/ark/ui/label"

export default function LabelDemo() {
  return (
    <div className="flex gap-2">
      <Checkbox id="terms">
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxHiddenInput />
      </Checkbox>
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
