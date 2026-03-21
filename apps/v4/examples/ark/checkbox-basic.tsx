import {
  Checkbox,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/examples/ark/ui/checkbox"

export function CheckboxBasic() {
  return (
    <div className="mx-auto w-56">
      <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic">
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>Accept terms and conditions</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
    </div>
  )
}
