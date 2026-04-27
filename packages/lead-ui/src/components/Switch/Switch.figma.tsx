import figma from "@figma/code-connect"

import { Switch } from "./Switch"

/**
 * Code Connect mapping: Lead Design System Switch → @leadbank/ui Switch.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:103697
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-103697
 *
 * Figma property surface (per supplied manifest):
 *   - Active (VARIANT): Off, On
 *   - Type (VARIANT): Default, Box
 *   - Side (VARIANT): Left, Right
 *   - State (VARIANT): Default, Focus
 *   - Label Text, Description Text (TEXT)
 *   - Show Label, Show Description (BOOLEAN)
 *
 * Mapped props:
 *   - checked ← figma.enum("Active", { On: true, Off: false })
 *
 * Not mapped (no clean correspondence — only `checked` lines up):
 *   - React `disabled` — Figma manifest's State only lists Default and
 *     Focus; there is no Disabled state on this component. If/when
 *     Figma adds one, extend this mapping.
 *   - React `size` — no Figma equivalent.
 *   - Figma "Type: Box" — Lead Switch ships a single visual today
 *     (track + thumb); no React-side variant matches "Box".
 *   - Figma "Side: Left/Right" — describes which side of a wrapping
 *     row the switch sits on; that's a layout concern handled by the
 *     consumer (or by Field), not by the Switch primitive itself.
 *   - Label / Description / Show* booleans — wrapper concerns.
 */
figma.connect(
  Switch,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-103697",
  {
    props: {
      checked: figma.enum("Active", {
        On: true,
        Off: false,
      }),
    },
    example: ({ checked }) => <Switch checked={checked} />,
  }
)
