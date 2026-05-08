import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@leadbank/ui"

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead dropdown menu built on @radix-ui/react-dropdown-menu. Compose with DropdownMenuTrigger + DropdownMenuContent containing DropdownMenuItem (regular), DropdownMenuCheckboxItem (multi-select), DropdownMenuRadioGroup + DropdownMenuRadioItem (single-select), DropdownMenuLabel (section heading), DropdownMenuSeparator, DropdownMenuGroup, and submenus via DropdownMenuSub*.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj<typeof DropdownMenu>

export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithCheckboxItems: Story = {
  name: "Checkbox items",
  render: () => {
    function Wrap() {
      const [showSidebar, setShowSidebar] = useState(true)
      const [showStatusBar, setShowStatusBar] = useState(true)
      const [showActivity, setShowActivity] = useState(false)
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">View options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showSidebar}
              onCheckedChange={setShowSidebar}
            >
              Sidebar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showStatusBar}
              onCheckedChange={setShowStatusBar}
            >
              Status bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showActivity}
              onCheckedChange={setShowActivity}
              disabled
            >
              Activity panel (disabled)
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    return <Wrap />
  },
}

export const WithRadioItems: Story = {
  name: "Radio items",
  render: () => {
    function Wrap() {
      const [position, setPosition] = useState("bottom")
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Panel position</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Position</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    return <Wrap />
  },
}

export const DisabledItems: Story = {
  name: "Disabled items",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled>
          Duplicate (read-only role)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Delete (admin only)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

export const WithSubmenu: Story = {
  name: "With submenu",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">File</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>New project</DropdownMenuItem>
        <DropdownMenuItem>Open…</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Open recent</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>lead-design-system</DropdownMenuItem>
            <DropdownMenuItem>internal-dashboard</DropdownMenuItem>
            <DropdownMenuItem>billing-rewrite</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Save</DropdownMenuItem>
        <DropdownMenuItem>Save as…</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

/**
 * Figma parity story (JES-95, batch D).
 *
 * Mirrors the Figma `Lead UI - DropdownMenu` (root 29:92788, content
 * 29:92680, item 29:92735, label 29:92802, separator 29:92856,
 * sub-trigger 29:92869). The highest-complexity inventory entry —
 * 8 `figma.connect()` calls in `DropdownMenu.figma.tsx` covering the
 * variant-as-component-switch pattern.
 *
 * Per the existing Code Connect mapping, Figma's documented item
 * properties are:
 *
 *   - Dropdown Menu Item Text (TEXT)
 *   - Show Icon (BOOLEAN)
 *   - Shortcut Text (TEXT) + Show Shortcut (BOOLEAN)
 *   - Variant (VARIANT): Default, Checkbox, Radio, Icon
 *   - State (VARIANT): Default, Hover, Disabled, Error
 *
 * Figma's `Variant` property switches *which React component is used*,
 * not which prop value is passed:
 *
 *   - Variant=Default  → `<DropdownMenuItem>`
 *   - Variant=Checkbox → `<DropdownMenuCheckboxItem>`
 *   - Variant=Radio    → `<DropdownMenuRadioItem>` (in `<DropdownMenuRadioGroup>`)
 *   - Variant=Icon     → no Lead equivalent (no icon-leading slot on items today)
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-92788
 *
 * **Documented non-parity exceptions:**
 *
 * 1. **Figma Variant=Icon has no Lead equivalent.**
 *    - **Difference:** Figma documents an item with leading icon as
 *      a Variant value; Lead's items have no icon-leading prop.
 *    - **Reason:** API shape — same icon-slot decision as Alert
 *      (§8.5). Adding icon support to dropdown items is a deliberate
 *      API decision PR (out of scope for parity work).
 *    - **Authority:** `DropdownMenu.figma.tsx` deliberate-unmapped
 *      block.
 *    - **Resolution:** Permanent unless an icon-slot API decision
 *      changes it.
 *
 * 2. **Figma Show Shortcut / Shortcut Text have no Lead equivalent.**
 *    - **Difference:** Figma documents keyboard shortcut display
 *      slots; Lead's `<DropdownMenuItem>` has no shortcut prop.
 *    - **Reason:** API shape — caller composes shortcuts via styled
 *      `<span>` children if desired.
 *    - **Authority:** `DropdownMenu.figma.tsx` deliberate-unmapped.
 *    - **Resolution:** Permanent unless a `<DropdownMenuShortcut>`
 *      subcomponent becomes a separate API decision.
 *
 * 3. **Figma State=Hover/Error are runtime/semantic states**, not
 *    React props. Same pattern as other batches.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (Variant=Default / Checkbox / Radio + Disabled)",
  render: () => (
    <div
      style={{
        padding: 24,
        background: "var(--lead-color-surface-default)",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Open menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* Variant=Default → DropdownMenuItem */}
          <DropdownMenuLabel>Variant=Default</DropdownMenuLabel>
          <DropdownMenuItem>Default item</DropdownMenuItem>
          <DropdownMenuItem disabled>State=Disabled</DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Variant=Checkbox → DropdownMenuCheckboxItem */}
          <DropdownMenuLabel>Variant=Checkbox</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked>
            Checked item
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Unchecked item</DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          {/* Variant=Radio → DropdownMenuRadioItem in RadioGroup */}
          <DropdownMenuLabel>Variant=Radio</DropdownMenuLabel>
          <DropdownMenuRadioGroup value="one">
            <DropdownMenuRadioItem value="one">Radio one</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="two">Radio two</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - DropdownMenu` (29:92788 root). " +
          "Demonstrates the variant-as-component-switch pattern: " +
          "Default → `<DropdownMenuItem>`, Checkbox → " +
          "`<DropdownMenuCheckboxItem>`, Radio → " +
          "`<DropdownMenuRadioItem>` (in `<DropdownMenuRadioGroup>`). " +
          "Includes `<DropdownMenuLabel>` section headings and " +
          "`<DropdownMenuSeparator>` between groups. Figma's Variant=" +
          "Icon, Show Shortcut/Shortcut Text, and State=Hover/Error " +
          "are documented non-parity (see story header for the " +
          "API-shape exceptions).",
      },
    },
  },
}
