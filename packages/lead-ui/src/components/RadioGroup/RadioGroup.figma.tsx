import figma from "@figma/code-connect"

import { RadioGroup, RadioGroupItem } from "./RadioGroup"

/**
 * Code Connect mapping: Lead Design System Radio item → @leadbank/ui
 * RadioGroupItem (rendered inside a RadioGroup).
 *
 * Figma source — Radio item: Lead Design System – CLI-Ready Staging,
 * node 29:97236
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97236
 *
 * Figma property surface (per supplied manifest):
 *   - Active (VARIANT): Off, On
 *   - Type (VARIANT): Default, Box
 *   - Font Weight (VARIANT): Medium, Regular
 *   - State (VARIANT): Default, Focus
 *   - Label Text, Description Text (TEXT)
 *   - Show Label, Show Description (BOOLEAN)
 *
 * No props are mapped: none of the Figma properties line up cleanly
 * with `RadioGroupItem`'s React API.
 *
 *   - `value` (the prop that identifies a radio item) is per-instance
 *     in React but is not a Figma component property — each Figma
 *     instance is its own item with its own label.
 *   - `Active: On/Off` reflects whether *this* radio is selected, but
 *     selection in Radix RadioGroup is controlled by the parent
 *     group's `value`, not a per-item `checked` prop. There is no
 *     React-side equivalent on `RadioGroupItem` to bind to.
 *   - `Type: Box` and `Font Weight` have no React-side variants today.
 *   - State Default/Focus does not include Disabled, so `disabled` is
 *     also not bindable from this manifest.
 *   - Label / Description are wrapper concerns handled by Field.
 *
 * The example below shows the canonical wrapping pattern so designers
 * dragging a Radio item instance into Dev Mode see the right code shape.
 *
 * Not mapped at all: the Radio group root node (29:97178). Its manifest
 * exposes no React-side props on `RadioGroup` (which has `value`,
 * `defaultValue`, `disabled`, `size`, `onValueChange` — none surfaced
 * as Figma component properties). When Figma exposes an "active value"
 * or "disabled" property on the group, revisit and add a second
 * `figma.connect(RadioGroup, ...)` call here.
 */
figma.connect(
  RadioGroupItem,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97236",
  {
    example: () => (
      <RadioGroup>
        <RadioGroupItem value="example" />
      </RadioGroup>
    ),
  }
)
