import figma from "@figma/code-connect"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs"

/**
 * Code Connect mapping: Lead Design System Tabs → @leadbank/ui Tabs family.
 *
 * Figma sources:
 *   - Tabs root: node 29:105685
 *     https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-105685
 *   - Tabs trigger: node 29:105668
 *     https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-105668
 *
 * Mapping shape:
 *
 *   Lead Tabs is *compositional* in React — `<TabsList>`, `<TabsTrigger>`,
 *   `<TabsContent>` are children. The Figma Tabs root has no boolean
 *   props worth fabricating; we map an example-only stub on the root
 *   that shows the canonical compositional shape, and a real prop
 *   mapping on `TabsTrigger` (where the Figma trigger node lives).
 *
 * Tabs root (29:105685) — example only:
 *   The Figma root component documents the assembled tabs widget.
 *   Designers in Dev Mode get the canonical `<Tabs><TabsList>…</TabsList>
 *   <TabsContent>…</TabsContent></Tabs>` shape to copy out.
 *
 * Tabs trigger (29:105668) — Figma property surface:
 *   - Tab Text (TEXT)
 *   - Active (BOOLEAN-as-VARIANT): Off, On
 *   - State (VARIANT): Default, Focus, Disabled
 *
 *   Mapped:
 *     - children ← figma.string("Tab Text")
 *     - disabled ← figma.enum("State", { Disabled: true })
 *
 *   Not mapped:
 *     - "Active" Off/On — selection in Radix Tabs is driven by matching
 *       `value` on the trigger to the parent `Tabs` `value`/`defaultValue`.
 *       It is not a prop on `TabsTrigger`; mapping it to a boolean would
 *       misrepresent the API.
 *     - State Default/Focus — runtime UI states, not React props.
 *     - React `size` — cascades from `Tabs` root via context; no Figma
 *       equivalent in this manifest.
 *     - React `value` (the trigger's required identifier) — must be
 *       supplied by the caller and has no Figma counterpart.
 */
figma.connect(
  Tabs,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-105685",
  {
    example: () => (
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">{/* one */}</TabsContent>
        <TabsContent value="two">{/* two */}</TabsContent>
      </Tabs>
    ),
  }
)

figma.connect(
  TabsTrigger,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-105668",
  {
    props: {
      label: figma.string("Tab Text"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
    },
    example: ({ label, disabled }) => (
      <TabsTrigger value="tab" disabled={disabled}>
        {label}
      </TabsTrigger>
    ),
  }
)
