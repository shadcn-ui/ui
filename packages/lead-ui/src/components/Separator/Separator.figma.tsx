import figma from "@figma/code-connect"

import { Separator } from "./Separator"

/**
 * Code Connect mapping: Lead Design System Separator → @leadbank/ui Separator.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:98862
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98862
 *
 * Figma property surface (per supplied manifest):
 *   - Orientation (VARIANT): Horizontal, Vertical
 *
 * Mapped props:
 *   - orientation ← figma.enum("Orientation", {
 *       Horizontal: "horizontal", Vertical: "vertical"
 *     })
 *
 * Not mapped:
 *   - React `variant` (`default`/`strong`) — no Figma equivalent in this
 *     manifest.
 *   - React `decorative` (boolean) — Lead's Separator is decorative-by-
 *     default to keep the divider out of the assistive-tech tree; this
 *     is a React-side accessibility choice, not a Figma property.
 */
figma.connect(
  Separator,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98862",
  {
    props: {
      orientation: figma.enum("Orientation", {
        Horizontal: "horizontal",
        Vertical: "vertical",
      }),
    },
    example: ({ orientation }) => <Separator orientation={orientation} />,
  }
)
