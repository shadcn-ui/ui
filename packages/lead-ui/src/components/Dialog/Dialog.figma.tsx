import figma from "@figma/code-connect"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog"

/**
 * Code Connect mapping: Lead Design System Dialog → @leadbank/ui Dialog family.
 *
 * Figma source: Lead Design System – CLI-Ready Staging, node 29:91865
 * https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-91865
 *
 * Mapping shape:
 *
 *   Lead Dialog is *compositional* in React — `<DialogTrigger>`,
 *   `<DialogContent>`, `<DialogHeader>`, `<DialogTitle>`,
 *   `<DialogDescription>`, `<DialogFooter>` are children. We connect
 *   the Figma Dialog node to `Dialog` (root) and render the canonical
 *   composition in the example with Title / Description text resolved
 *   as locals.
 *
 * Mapped:
 *   - titleText ← figma.string("Title Text") → DialogTitle children
 *   - descriptionText ← figma.string("Description Text") →
 *     DialogDescription children
 *
 * Not mapped (intentional):
 *   - "Breakpoint" — Figma documents responsive sizing variants; Lead
 *     Dialog has a `size` prop on `DialogContent` (`sm`/`md`/`lg`) but
 *     the Figma breakpoint names are layout-density tokens, not Lead
 *     size names. Mapping them would require asserting an equivalence
 *     this manifest does not document.
 *   - Slot instance swaps (icon / footer button) — instance-swap props
 *     don't have React-prop equivalents in Lead's compositional API.
 *     Designers include or omit `<DialogFooter>` etc. in their layout.
 *   - React `size` (DialogContent), `align` (DialogFooter),
 *     `DialogTrigger`/`DialogClose` — no Figma equivalents in this
 *     manifest. Trigger is shown in the example as a placeholder.
 */
figma.connect(
  Dialog,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-91865",
  {
    props: {
      titleText: figma.string("Title Text"),
      descriptionText: figma.string("Description Text"),
    },
    example: ({ titleText, descriptionText }) => (
      <Dialog>
        <DialogTrigger>{/* trigger */}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{titleText}</DialogTitle>
            <DialogDescription>{descriptionText}</DialogDescription>
          </DialogHeader>
          {/* body / DialogFooter */}
        </DialogContent>
      </Dialog>
    ),
  }
)
