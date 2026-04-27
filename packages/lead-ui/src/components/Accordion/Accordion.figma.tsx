import figma from "@figma/code-connect"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion"

/**
 * Code Connect mapping: Lead Design System Accordion → @leadbank/ui
 * Accordion family.
 *
 * Figma sources:
 *   - Accordion root: node 29:66202
 *     https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66202
 *   - Accordion item: node 29:66236
 *     https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66236
 *
 * Mapping shape:
 *
 *   Lead Accordion is *compositional* in React — `<AccordionItem>`,
 *   `<AccordionTrigger>`, `<AccordionContent>` are children. The Figma
 *   Accordion root has no boolean props worth fabricating; we map an
 *   example-only stub on the root that shows the canonical
 *   compositional shape, and a real prop mapping on `AccordionItem`
 *   (where the Figma item node lives).
 *
 * Accordion root (29:66202) — example only:
 *   Designers in Dev Mode get the canonical `<Accordion type="single"
 *   collapsible><AccordionItem>…</AccordionItem></Accordion>` shape to
 *   copy out.
 *
 * Accordion item (29:66236) — Figma property surface:
 *   - Trigger Text (TEXT)
 *   - Content Text (TEXT)
 *   - Active (BOOLEAN-as-VARIANT): Off, On
 *   - State (VARIANT): Default, Hover, Focus, Pressed
 *
 *   Mapping shape: AccordionItem has no `triggerText`/`contentText`
 *   React props — Trigger and Content are children components. We
 *   resolve the two TEXT props as locals and place them inside
 *   `AccordionTrigger`/`AccordionContent` in the example body.
 *
 *   Mapped:
 *     - triggerText ← figma.string("Trigger Text") → AccordionTrigger children
 *     - contentText ← figma.string("Content Text") → AccordionContent children
 *
 *   Not mapped:
 *     - "Active" Off/On — open/closed state in Radix Accordion is driven
 *       by matching `value` on the item to the parent `Accordion`'s
 *       `value`/`defaultValue`. It is not a prop on `AccordionItem`;
 *       mapping it to a boolean would misrepresent the API.
 *     - State Default/Hover/Focus/Pressed — runtime UI states, not
 *       React props.
 *     - React `value` (the item's required identifier) — must be
 *       supplied by the caller and has no Figma counterpart.
 */
figma.connect(
  Accordion,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66202",
  {
    example: () => (
      <Accordion type="single" collapsible>
        <AccordionItem value="one">
          <AccordionTrigger>One</AccordionTrigger>
          <AccordionContent>{/* one */}</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  }
)

figma.connect(
  AccordionItem,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66236",
  {
    props: {
      triggerText: figma.string("Trigger Text"),
      contentText: figma.string("Content Text"),
    },
    example: ({ triggerText, contentText }) => (
      <AccordionItem value="item">
        <AccordionTrigger>{triggerText}</AccordionTrigger>
        <AccordionContent>{contentText}</AccordionContent>
      </AccordionItem>
    ),
  }
)
