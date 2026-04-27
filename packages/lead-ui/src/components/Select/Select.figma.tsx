import figma from "@figma/code-connect"

import { Field } from "../Field/Field"
import { FieldDescription } from "../Field/FieldDescription"
import { FieldLabel } from "../Field/FieldLabel"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./Select"

/**
 * Code Connect mappings: Lead Design System Select → @leadbank/ui Select family.
 *
 * Lead Select is *compositional*: `Select` is the Radix root (no UI),
 * `SelectTrigger` is the visible control, `SelectValue` carries the
 * placeholder, `SelectContent` portals the listbox, and `SelectItem`s
 * render options. Label/description live in a parent `Field` +
 * `FieldLabel` / `FieldDescription` per Lead's form-field composition
 * convention.
 *
 * The Figma node graph:
 *   - 29:98157 = Select trigger/control (the *whole* labeled field — not
 *                 just the button — with Label / Description / Placeholder
 *                 string slots and State variants)
 *   - 29:97998 = Select item
 *   - 29:98193 = Select menu (the listbox container)
 *   - 29:97936 = Select label (a group label inside the menu, mapped to
 *                 SelectLabel inside SelectContent — distinct from the
 *                 Field-level FieldLabel)
 *
 * We connect each node to the closest truthful React anchor and use
 * compositional examples where the Figma surface doesn't have a 1:1
 * React-prop equivalent.
 */

/**
 * Select trigger/control (29:98157) → `Select` root.
 *
 * Figma property surface (per supplied manifest):
 *   - Label Text (TEXT)
 *   - Show Label (BOOLEAN)
 *   - Description Text (TEXT)
 *   - Show Description (BOOLEAN)
 *   - Placeholder (TEXT)
 *   - Show Icon (BOOLEAN)
 *   - State (VARIANT): Default, Focus, Filled, "Filled (Focus)", Disabled
 *
 * Mapped:
 *   - disabled ← figma.enum("State", { Disabled: true })
 *   - labelText, descriptionText, placeholder are resolved as TEXT
 *     locals and rendered into the canonical composition.
 *
 * Not mapped:
 *   - Show Label / Show Description / Show Icon — visibility booleans
 *     in Figma. Lead's React composition doesn't have a "show" prop;
 *     you simply include or omit the subcomponent. Designers can
 *     delete the FieldLabel / FieldDescription line in the example to
 *     reflect a Show=false instance.
 *   - State Default / Focus / Filled / "Filled (Focus)" — runtime UI
 *     and *value* states, not React props. "Filled" is implied by
 *     `value` / `defaultValue`; focus is browser-driven.
 *   - React `size` / `invalid` on `SelectTrigger`, `name` / `required`
 *     on `Select` root — no Figma equivalents in this manifest.
 */
figma.connect(
  Select,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98157",
  {
    props: {
      labelText: figma.string("Label Text"),
      descriptionText: figma.string("Description Text"),
      placeholder: figma.string("Placeholder"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
    },
    example: ({ labelText, descriptionText, placeholder, disabled }) => (
      <Field>
        <FieldLabel>{labelText}</FieldLabel>
        <Select disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{/* <SelectItem value="…">…</SelectItem> */}</SelectContent>
        </Select>
        <FieldDescription>{descriptionText}</FieldDescription>
      </Field>
    ),
  }
)

/**
 * Select item (29:97998) → `SelectItem`.
 *
 * Figma property surface (per supplied manifest):
 *   - Select Item Text (TEXT)
 *   - Show Icon (BOOLEAN)
 *   - Type (VARIANT): Simple, Icon
 *   - Variant (VARIANT): Default, Checkbox
 *   - State (VARIANT): Default, Hover
 *
 * Mapped:
 *   - children ← figma.string("Select Item Text")
 *
 * Not mapped (intentional):
 *   - Show Icon / Type Simple-or-Icon — Lead's `SelectItem` does not
 *     accept a leading-icon prop. Adding icon support is a deliberate
 *     API decision (out of scope for a mapping PR); leaving these
 *     unmapped means we don't fabricate a prop.
 *   - Variant Default / Checkbox — Lead's `SelectItem` always shows a
 *     check indicator (`SelectItemIndicator` with check icon) for the
 *     selected option; Figma's "Checkbox" variant is a different
 *     visual treatment with no React equivalent in Lead today.
 *   - State Default / Hover — runtime UI states, not React props.
 *   - Figma manifest does *not* list a Disabled state for items; we do
 *     not invent a `disabled` mapping (per the prompt's explicit
 *     instruction: "do not invent it").
 *   - React `value` — required identifier; must be supplied by the
 *     caller and has no Figma counterpart.
 */
figma.connect(
  SelectItem,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97998",
  {
    props: {
      label: figma.string("Select Item Text"),
    },
    example: ({ label }) => <SelectItem value="item">{label}</SelectItem>,
  }
)

/**
 * Select label (29:97936) → `SelectLabel` (the in-menu group label,
 * not the field-level label).
 *
 * Figma property surface:
 *   - Label Text (TEXT)
 *
 * Mapped:
 *   - children ← figma.string("Label Text")
 */
figma.connect(
  SelectLabel,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97936",
  {
    props: {
      label: figma.string("Label Text"),
    },
    example: ({ label }) => <SelectLabel>{label}</SelectLabel>,
  }
)

/**
 * Select menu (29:98193) → `SelectContent`, example only.
 *
 * The Figma "menu" node is the listbox container. Lead's `SelectContent`
 * has no boolean props worth mapping (position / sideOffset are layout
 * tuning, not Figma surface). The example documents the canonical
 * `<SelectContent><SelectItem /><SelectItem /></SelectContent>` shape
 * for designers in Dev Mode.
 */
figma.connect(
  SelectContent,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98193",
  {
    example: () => (
      <SelectContent>
        <SelectItem value="one">One</SelectItem>
        <SelectItem value="two">Two</SelectItem>
      </SelectContent>
    ),
  }
)
