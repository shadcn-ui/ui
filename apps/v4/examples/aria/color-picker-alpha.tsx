import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatch,
} from "@/styles/aria-nova/ui/color-picker"
import { Field, FieldLabel } from "@/styles/aria-nova/ui/field"

export default function ColorPickerAlphaDemo() {
  return (
    <Field className="max-w-64">
      <FieldLabel htmlFor="color-picker-alpha">Overlay</FieldLabel>
      <ColorPicker defaultValue="#0f172a80">
        <ColorPickerArea />
        <ColorPickerHue />
        <ColorPickerAlpha />
        <div className="flex items-center gap-2">
          <ColorPickerSwatch />
          <ColorPickerInput id="color-picker-alpha" />
        </div>
      </ColorPicker>
    </Field>
  )
}
