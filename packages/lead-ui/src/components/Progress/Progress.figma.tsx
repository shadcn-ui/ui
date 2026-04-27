import figma from "@figma/code-connect"

import { Progress } from "./Progress"

/**
 * Code Connect mapping: Lead Design System Progress → @leadbank/ui Progress.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:97110
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97110
 *
 * Figma property surface (per supplied manifest):
 *   - Percent (VARIANT): "100%" | "75%" | "50%" | "25%" | "0%"
 *
 * Mapped props:
 *   - value ← figma.enum("Percent", {...}) — Figma's discrete percentage
 *     variants resolve to React's numeric `value` prop (0–100, with
 *     `max` defaulting to 100).
 *
 * Not mapped:
 *   - React `size` (`sm`/`md`/`lg`), `variant` (`default`/`success`/
 *     `warning`/`danger`), `max` — no Figma equivalents in this
 *     manifest. Indeterminate state (`value === undefined`) likewise has
 *     no Figma counterpart; the discrete enum always resolves to a
 *     number.
 */
figma.connect(
  Progress,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97110",
  {
    props: {
      value: figma.enum("Percent", {
        "100%": 100,
        "75%": 75,
        "50%": 50,
        "25%": 25,
        "0%": 0,
      }),
    },
    example: ({ value }) => <Progress value={value} />,
  }
)
