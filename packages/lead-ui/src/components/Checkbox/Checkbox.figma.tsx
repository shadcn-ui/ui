import figma from "@figma/code-connect"

import { Checkbox } from "./Checkbox"

/**
 * Code Connect mapping: Lead Design System Checkbox → @leadbank/ui Checkbox.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:85556
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-85556
 *
 * Figma property surface (per supplied manifest):
 *   - Status (VARIANT): Inactive, Active
 *   - State (VARIANT): Default, Focus, Disabled, Pressed
 *   - Label Text, Description Text (TEXT)
 *   - Show Label, Show Description (BOOLEAN)
 *
 * React Checkbox is a *primitive* — labels and descriptions live in the
 * Field family. Figma label/description properties are intentionally NOT
 * mapped here.
 *
 * Mapped props:
 *   - checked  ← figma.enum("Status", { Active: true, Inactive: false })
 *   - disabled ← figma.enum("State", { Disabled: true })
 *
 * Not mapped (no clean correspondence):
 *   - React `size` — no Figma equivalent in this manifest.
 *   - React `invalid` — Figma manifest does not list an error/invalid
 *     state for Checkbox.
 *   - Tri-state `checked={"indeterminate"}` — Figma manifest lists
 *     binary Active/Inactive only.
 */
figma.connect(
  Checkbox,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-85556",
  {
    props: {
      checked: figma.enum("Status", {
        Active: true,
        Inactive: false,
      }),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
    },
    example: ({ checked, disabled }) => (
      <Checkbox checked={checked} disabled={disabled} />
    ),
  }
)
