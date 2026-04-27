import figma from "@figma/code-connect"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip"

/**
 * Code Connect mapping: Lead Design System Tooltip → @leadbank/ui Tooltip family.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:107066
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-107066
 *
 * Mapping shape:
 *
 *   Lead Tooltip is *compositional* — `<TooltipProvider>`, `<Tooltip>`,
 *   `<TooltipTrigger>`, `<TooltipContent>`. The Figma Tooltip node
 *   carries the visible content text and the side enum, both of which
 *   land on `TooltipContent`. We connect the Figma node to `Tooltip`
 *   (root) and render the canonical composition in the example.
 *
 * Mapped:
 *   - tooltipText ← figma.string("Tooltip Text") → TooltipContent children
 *   - side ← figma.enum("Side", { Top, Right, Bottom, Left }) →
 *     TooltipContent `side` (matches Radix's "top"|"right"|"bottom"|"left")
 *
 * Not mapped:
 *   - React `align`, `sideOffset`, `delayDuration` (provider) — Lead-
 *     side layout/timing tuning, no Figma equivalents in this manifest.
 */
figma.connect(
  Tooltip,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-107066",
  {
    props: {
      tooltipText: figma.string("Tooltip Text"),
      side: figma.enum("Side", {
        Top: "top",
        Right: "right",
        Bottom: "bottom",
        Left: "left",
      }),
    },
    example: ({ tooltipText, side }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>{/* trigger */}</TooltipTrigger>
          <TooltipContent side={side}>{tooltipText}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  }
)
