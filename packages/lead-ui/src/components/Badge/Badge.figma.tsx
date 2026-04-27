import figma from "@figma/code-connect"

import { Badge } from "./Badge"

/**
 * Code Connect mapping: Lead Design System Badge → @leadbank/ui Badge.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:66938
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66938
 *
 * Figma property surface (per supplied manifest):
 *   - Variant (VARIANT): Default, Secondary, Outline, Destructive, Verified
 *   - State (VARIANT): Default, Hover, Focus
 *   - Badge Text (TEXT)
 *
 * Mapped props:
 *   - variant: see notes below.
 *   - children ← figma.string("Badge Text") (the badge label)
 *
 * Variant mapping decisions:
 *   - "Default"     → "neutral"  (Lead's neutral badge is the default tint)
 *   - "Secondary"   → "brand"    (Lead's brand badge uses the Lead-blue
 *                                 secondary surface, matching Figma's
 *                                 Secondary tint)
 *   - "Destructive" → "danger"   (red-tinted error badge)
 *   - "Verified"    → "success"  (Verified is conventionally a checkmark
 *                                 with green/success semantics; mapping
 *                                 to Lead's `success` variant per the
 *                                 supplied directive that Verified should
 *                                 either map to `success` or be left
 *                                 unmapped)
 *
 * Not mapped (no clean correspondence):
 *   - "Outline" — Lead Badge has no outline-style variant. Mapping to one
 *     of the existing Lead variants would misrepresent the visual; leaving
 *     unmapped means instances using Outline simply don't resolve a
 *     React-side variant value (Code Connect renders the example with
 *     whatever the React default is).
 *   - State Default/Hover/Focus — Badge is non-interactive in Lead;
 *     hover/focus states aren't a React-API concept here.
 *   - React `size` (sm/md/lg) — no Figma equivalent in this manifest.
 *   - React `dot` (boolean) — no Figma equivalent.
 */
figma.connect(
  Badge,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66938",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "neutral",
        Secondary: "brand",
        Destructive: "danger",
        Verified: "success",
      }),
      label: figma.string("Badge Text"),
    },
    example: ({ variant, label }) => (
      <Badge variant={variant}>{label}</Badge>
    ),
  }
)
