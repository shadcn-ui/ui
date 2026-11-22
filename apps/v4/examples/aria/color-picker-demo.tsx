import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerCopy,
  ColorPickerEyeDropper,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatch,
} from "@/styles/aria-nova/ui/color-picker"
import { Field, FieldLabel } from "@/styles/aria-nova/ui/field"

export default function ColorPickerDemo() {
  return (
    <Field className="max-w-64">
      <FieldLabel htmlFor="color-picker-demo">Brand color</FieldLabel>
      <ColorPicker defaultValue="#3b82f6">
        <ColorPickerArea />
        <ColorPickerHue />
        <div className="flex items-center gap-2">
          <ColorPickerSwatch />
          <ColorPickerInput id="color-picker-demo" />
          <ColorPickerEyeDropper />
          <ColorPickerCopy />
        </div>
      </ColorPicker>
    </Field>
  )
}
