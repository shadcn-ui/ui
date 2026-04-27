import figma from "@figma/code-connect"

import { Skeleton } from "./Skeleton"

/**
 * Code Connect mapping: Lead Design System Skeleton → @leadbank/ui Skeleton.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:103198
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-103198
 *
 * Figma property surface (per supplied manifest):
 *   - Variant (VARIANT): Default, Card, Text
 *
 * Mapped props:
 *   - shape ← figma.enum("Variant", { Text: "text" })
 *
 * Not mapped (no clean correspondence):
 *   - "Default" — Lead Skeleton's React default is `shape="rect"`. The
 *     Figma "Default" variant could *plausibly* mean "the basic
 *     rectangular skeleton," but this is an approximation, not a name
 *     match. Leaving unmapped means instances using "Default" simply
 *     fall through to the React default (`rect`) on the example side
 *     without us asserting an explicit equivalence.
 *   - "Card" — Lead Skeleton has no `card` shape (only `text`/`rect`/
 *     `circle`). A Figma "Card" skeleton is typically a composition of
 *     multiple Skeletons (a header bar + body bars), not a single
 *     `<Skeleton variant="card" />`. Mapping it to one of the existing
 *     React shapes would misrepresent the visual.
 *   - React `decorative` (boolean) — accessibility-side default
 *     (decorative means `aria-hidden="true"` and `role="none"`), not a
 *     Figma property.
 */
figma.connect(
  Skeleton,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-103198",
  {
    props: {
      shape: figma.enum("Variant", {
        Text: "text",
      }),
    },
    example: ({ shape }) => <Skeleton shape={shape} />,
  }
)
