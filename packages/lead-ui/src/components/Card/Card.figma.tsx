import figma from "@figma/code-connect"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./Card"

/**
 * Code Connect mapping: Lead Design System Card → @leadbank/ui Card family.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:72255
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-72255
 *
 * Figma property surface (per supplied manifest):
 *   - Card Title, Card Description (TEXT)
 *   - Card Header, Card Content, Card Footer (BOOLEAN — show/hide section)
 *
 * Mapping shape:
 *
 *   Lead Card is *compositional* in React — `<CardHeader>`, `<CardContent>`,
 *   `<CardFooter>` are children components, not boolean props. Figma's
 *   "show section" booleans don't correspond to a React prop; instead, you
 *   choose which subcomponents to render. We therefore:
 *
 *     - Map only the two TEXT props (Title / Description) to Lead's
 *       `CardTitle` / `CardDescription` children.
 *     - Render a canonical compositional example with `CardHeader >
 *       CardTitle + CardDescription` and a `CardContent` body slot. This
 *       gives designers in Dev Mode the right code shape to copy out;
 *       they then adjust `CardContent` / drop in `CardFooter` as their
 *       layout requires.
 *
 * Not mapped (intentional):
 *   - Figma Card Header / Card Content / Card Footer booleans — no React
 *     prop equivalents. These describe whether to render the
 *     corresponding subcomponent in the example, not a flag the React
 *     `<Card>` accepts.
 *   - React `padding` (`none`/`sm`/`md`/`lg`) and `variant`
 *     (`default`/`muted`/`outline`) — no Figma equivalents in this
 *     manifest.
 */
figma.connect(
  Card,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-72255",
  {
    props: {
      title: figma.string("Card Title"),
      description: figma.string("Card Description"),
    },
    example: ({ title, description }) => (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{/* body */}</CardContent>
      </Card>
    ),
  }
)
