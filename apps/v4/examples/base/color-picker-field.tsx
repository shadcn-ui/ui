import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatch,
} from "@/styles/base-nova/ui/color-picker"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/styles/base-nova/ui/field"

export default function ColorPickerField() {
  return (
    <FieldGroup className="max-w-64">
      <Field data-invalid>
        <FieldLabel htmlFor="color-picker-invalid">Accent</FieldLabel>
        <ColorPicker aria-invalid defaultValue="#fef08a">
          <ColorPickerArea />
          <ColorPickerHue />
          <div className="flex items-center gap-2">
            <ColorPickerSwatch />
            <ColorPickerInput id="color-picker-invalid" />
          </div>
        </ColorPicker>
        <FieldError>Pick a color with more contrast.</FieldError>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="color-picker-disabled">Locked</FieldLabel>
        <ColorPicker defaultValue="#64748b" disabled>
          <ColorPickerArea />
          <ColorPickerHue />
          <div className="flex items-center gap-2">
            <ColorPickerSwatch />
            <ColorPickerInput id="color-picker-disabled" />
          </div>
        </ColorPicker>
      </Field>
    </FieldGroup>
  )
}
