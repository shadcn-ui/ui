import figma from "@figma/code-connect"

import { Input } from "./Input"

/**
 * Code Connect mapping: Lead Design System Input → @leadbank/ui Input.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:95030
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-95030
 *
 * Figma property surface (per supplied manifest):
 *   - Variant (VARIANT): Default, File
 *   - State (VARIANT): Default, Focus, Filled, Disabled, Error, Error Focus
 *   - Label Text, Placeholder Text, Description Text (TEXT)
 *   - Show Label, Show Description, Show Icon, Show Link (BOOLEAN)
 *   - Horizontal Layout (BOOLEAN)
 *
 * React Input is a *primitive* — it does not render its own label,
 * description, or icon. The Field family (Field + FieldLabel +
 * FieldDescription + FieldControl) handles those wrapping concerns,
 * so the corresponding Figma properties are intentionally NOT mapped
 * here. They will be revisited if/when a Field Code Connect mapping
 * lands.
 *
 * Mapped props (only those that line up cleanly across both surfaces):
 *   - placeholder ← figma.string("Placeholder Text")
 *   - disabled    ← figma.enum("State", { Disabled: true })
 *   - invalid     ← figma.enum("State", { Error: true, "Error Focus": true })
 *
 * Not mapped (no clean correspondence):
 *   - Figma "Variant: File" — Lead Input is text-only today; instances
 *     using Variant=File won't resolve a React-side variant.
 *   - React `size` — no Figma equivalent in this manifest.
 *   - React `variant` ("default" | "error") — overlaps with State; the
 *     `invalid` mapping above already drives the error visual.
 */
figma.connect(
  Input,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-95030",
  {
    props: {
      placeholder: figma.string("Placeholder Text"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
      invalid: figma.enum("State", {
        Error: true,
        "Error Focus": true,
      }),
    },
    example: ({ placeholder, disabled, invalid }) => (
      <Input
        placeholder={placeholder}
        disabled={disabled}
        invalid={invalid}
      />
    ),
  }
)
