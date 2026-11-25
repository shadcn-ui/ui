"use client"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerCopy,
  ColorPickerEyeDropper,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatch,
} from "@/registry/bases/base/ui/color-picker"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/bases/base/ui/field"

export default function ColorPickerExample() {
  return (
    <ExampleWrapper>
      <ColorPickerBasic />
      <ColorPickerWithAlpha />
      <ColorPickerOklch />
      <ColorPickerInvalid />
      <ColorPickerDisabled />
    </ExampleWrapper>
  )
}

function ColorPickerBasic() {
  return (
    <Example title="Basic">
      <Field>
        <FieldLabel htmlFor="color-picker-basic">Color</FieldLabel>
        <ColorPicker defaultValue="#3b82f6">
          <ColorPickerArea />
          <ColorPickerHue />
          <div className="flex items-center gap-2">
            <ColorPickerSwatch />
            <ColorPickerInput id="color-picker-basic" />
            <ColorPickerEyeDropper />
            <ColorPickerCopy />
          </div>
        </ColorPicker>
      </Field>
    </Example>
  )
}

function ColorPickerWithAlpha() {
  return (
    <Example title="Alpha">
      <Field>
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
    </Example>
  )
}

function ColorPickerOklch() {
  return (
    <Example title="OKLCH">
      <Field>
        <FieldLabel htmlFor="color-picker-oklch">Primary</FieldLabel>
        <ColorPicker defaultValue="oklch(0.546 0.245 262.881)">
          <ColorPickerArea />
          <ColorPickerHue />
          <div className="flex items-center gap-2">
            <ColorPickerSwatch />
            <ColorPickerInput id="color-picker-oklch" />
          </div>
        </ColorPicker>
        <FieldDescription>
          Values use the same format as theme tokens.
        </FieldDescription>
      </Field>
    </Example>
  )
}

function ColorPickerInvalid() {
  return (
    <Example title="Invalid">
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
    </Example>
  )
}

function ColorPickerDisabled() {
  return (
    <Example title="Disabled">
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
    </Example>
  )
}
