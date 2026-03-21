import {
  Checkbox,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/examples/ark/ui/checkbox"

export default function CheckboxDemo() {
  return (
    <div className="max-w-sm space-y-4">
      <Checkbox id="terms-checkbox" name="terms-checkbox">
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
      <Checkbox
        id="terms-checkbox-2"
        name="terms-checkbox-2"
        defaultChecked
      >
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
      <Checkbox
        id="toggle-checkbox"
        name="toggle-checkbox"
        disabled
      >
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>Enable notifications</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
      <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2">
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>Enable notifications</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
    </div>
  )
}
