import {
  Checkbox,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/examples/ark/ui/checkbox"

export function CheckboxInvalid() {
  return (
    <div className="mx-auto w-56">
      <Checkbox
        id="terms-checkbox-invalid"
        name="terms-checkbox-invalid"
        aria-invalid
      >
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
    </div>
  )
}
