import {
  Checkbox,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/examples/ark/ui/checkbox"

export function CheckboxDisabled() {
  return (
    <div className="mx-auto w-56">
      <Checkbox
        id="toggle-checkbox-disabled"
        name="toggle-checkbox-disabled"
        disabled
      >
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>Enable notifications</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
    </div>
  )
}
