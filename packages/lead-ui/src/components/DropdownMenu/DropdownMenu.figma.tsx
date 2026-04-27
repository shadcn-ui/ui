import figma from "@figma/code-connect"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./DropdownMenu"

/**
 * Code Connect mappings: Lead Design System DropdownMenu →
 * @leadbank/ui DropdownMenu family.
 *
 * Lead DropdownMenu is *compositional* and has the most subcomponent
 * surface of any Lead component to date: trigger, content, item,
 * checkbox-item, radio-group + radio-item, label, separator,
 * sub (+ sub-trigger + sub-content). The Figma manifest reflects this
 * with five distinct nodes:
 *
 *   - 29:92788  DropdownMenu root         → example-only canonical shape
 *   - 29:92680  Content / menu            → example-only canonical shape
 *   - 29:92735  Default item              → multi-variant mapping (one
 *                                            connect per Variant value
 *                                            because Variant switches
 *                                            React component, not prop)
 *   - 29:92802  Label item                → text mapping
 *   - 29:92856  Separator                 → example-only
 *   - 29:92869  SubTrigger                → text mapping
 *
 * Variant-as-component-switch is the key idea: Figma's "Variant"
 * property on the item node has values Default / Checkbox / Radio /
 * Icon, but in React these are *separate components*
 * (DropdownMenuItem / DropdownMenuCheckboxItem / DropdownMenuRadioItem
 * / no equivalent for Icon). Code Connect supports this via per-
 * variant `figma.connect()` calls scoped with the `variant` filter.
 */

/* ── Root: example-only ───────────────────────────────────────────── */

figma.connect(
  DropdownMenu,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92788",
  {
    example: () => (
      <DropdownMenu>
        <DropdownMenuTrigger>{/* trigger */}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>{/* item */}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }
)

/* ── Content / menu: example-only ─────────────────────────────────── */

figma.connect(
  DropdownMenuContent,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92680",
  {
    example: () => (
      <DropdownMenuContent>
        <DropdownMenuItem>{/* item */}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{/* item */}</DropdownMenuItem>
      </DropdownMenuContent>
    ),
  }
)

/* ── Default item (29:92735) — Variant switches the React component ─
 *
 * Figma property surface:
 *   - Dropdown Menu Item Text (TEXT)
 *   - Show Icon (BOOLEAN)
 *   - Shortcut Text (TEXT)
 *   - Show Shortcut (BOOLEAN)
 *   - Variant (VARIANT): Default, Checkbox, Radio, Icon
 *   - State (VARIANT): Default, Hover, Disabled, Error
 *
 * Mapped per-variant:
 *   - Variant=Default   → DropdownMenuItem
 *   - Variant=Checkbox  → DropdownMenuCheckboxItem
 *   - Variant=Radio     → DropdownMenuRadioItem (wrapped in
 *                           DropdownMenuRadioGroup in the example)
 *   - Variant=Icon      → not mapped (Lead's DropdownMenuItem has no
 *                           icon prop; the prompt forbids inventing one)
 *
 * For each mapped variant:
 *   - children ← figma.string("Dropdown Menu Item Text")
 *   - disabled ← figma.enum("State", { Disabled: true })
 *
 * Not mapped (intentional):
 *   - Show Icon — no React equivalent (no icon prop on any item type).
 *   - Shortcut Text / Show Shortcut — Lead has no Shortcut subcomponent;
 *     mapping these would require fabricating React surface.
 *   - State Default / Hover / Error — runtime UI states, not props.
 *     ("Error" has no React-prop equivalent on items today.)
 *   - Variant=Icon — see above.
 */

figma.connect(
  DropdownMenuItem,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92735",
  {
    variant: { Variant: "Default" },
    props: {
      label: figma.string("Dropdown Menu Item Text"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
    },
    example: ({ label, disabled }) => (
      <DropdownMenuItem disabled={disabled}>{label}</DropdownMenuItem>
    ),
  }
)

figma.connect(
  DropdownMenuCheckboxItem,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92735",
  {
    variant: { Variant: "Checkbox" },
    props: {
      label: figma.string("Dropdown Menu Item Text"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
    },
    example: ({ label, disabled }) => (
      <DropdownMenuCheckboxItem disabled={disabled}>
        {label}
      </DropdownMenuCheckboxItem>
    ),
  }
)

figma.connect(
  DropdownMenuRadioItem,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92735",
  {
    variant: { Variant: "Radio" },
    props: {
      label: figma.string("Dropdown Menu Item Text"),
      disabled: figma.enum("State", {
        Disabled: true,
      }),
    },
    example: ({ label, disabled }) => (
      <DropdownMenuRadioGroup value="item">
        <DropdownMenuRadioItem value="item" disabled={disabled}>
          {label}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    ),
  }
)

/* ── Label item (29:92802) ────────────────────────────────────────── */

/**
 * Figma property surface:
 *   - Label Text (TEXT)
 *   - Level (VARIANT): 1, 2
 *
 * Mapped:
 *   - children ← figma.string("Label Text")
 *
 * Not mapped:
 *   - Level 1 / 2 — Lead's `DropdownMenuLabel` is a thin passthrough on
 *     Radix's Label primitive. It has no `inset`, `level`, or visual-
 *     hierarchy prop. Mapping Level to a non-existent prop would be
 *     fabrication.
 */
figma.connect(
  DropdownMenuLabel,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92802",
  {
    props: {
      label: figma.string("Label Text"),
    },
    example: ({ label }) => <DropdownMenuLabel>{label}</DropdownMenuLabel>,
  }
)

/* ── Separator (29:92856) — example-only ──────────────────────────── */

figma.connect(
  DropdownMenuSeparator,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92856",
  {
    example: () => <DropdownMenuSeparator />,
  }
)

/* ── SubTrigger (29:92869) ────────────────────────────────────────── */

/**
 * Figma property surface:
 *   - SubTrigger Text (TEXT)
 *   - Active (VARIANT): No, Yes
 *
 * Mapped:
 *   - children ← figma.string("SubTrigger Text")
 *
 * Example wraps in `DropdownMenuSub` + `DropdownMenuSubContent` so
 * designers in Dev Mode get a working snippet for nested menus.
 *
 * Not mapped:
 *   - Active No / Yes — open/closed runtime state in Radix, driven by
 *     the parent `DropdownMenuSub`'s open state, not a prop on
 *     `DropdownMenuSubTrigger`. Mapping it to a boolean would
 *     misrepresent the API.
 */
figma.connect(
  DropdownMenuSubTrigger,
  "https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92869",
  {
    props: {
      label: figma.string("SubTrigger Text"),
    },
    example: ({ label }) => (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>{label}</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {/* nested items */}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    ),
  }
)
