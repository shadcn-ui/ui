import figma from "@figma/code-connect"

import { Popover, PopoverContent, PopoverTrigger } from "./Popover"

/**
 * Code Connect mapping: Lead Design System Popover → @leadbank/ui Popover family.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:96969
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-96969
 *
 * Mapping shape:
 *
 *   Lead Popover is *compositional* in React — `<PopoverTrigger>`,
 *   `<PopoverContent>` are children. The Figma Popover node has no
 *   text/enum properties in the supplied manifest worth mapping; we
 *   connect example-only so designers in Dev Mode get the canonical
 *   `<Popover><PopoverTrigger /><PopoverContent /></Popover>` shape to
 *   copy out.
 *
 * Not mapped:
 *   - No props are invented. `side`, `align`, `sideOffset` on
 *     `PopoverContent` are Lead-side layout tuning, not Figma
 *     properties in this manifest.
 */
figma.connect(
  Popover,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-96969",
  {
    example: () => (
      <Popover>
        <PopoverTrigger>{/* trigger */}</PopoverTrigger>
        <PopoverContent>{/* body */}</PopoverContent>
      </Popover>
    ),
  }
)
