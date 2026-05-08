import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@leadbank/ui"

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead Button. Variants for primary/secondary/outline/ghost/danger, three sizes, plus disabled and loading states. Internal data-* state attributes cannot be overridden by callers.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "ghost", "danger"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: "primary" },
}

export const Secondary: Story = {
  args: { variant: "secondary" },
}

export const Outline: Story = {
  args: { variant: "outline" },
}

export const Ghost: Story = {
  args: { variant: "ghost" },
}

export const Danger: Story = {
  args: { variant: "danger" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const Medium: Story = {
  args: { size: "md" },
}

export const Large: Story = {
  args: { size: "lg" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Loading: Story = {
  args: { loading: true },
}

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: <PlusIcon />,
    children: "New item",
  },
}

export const WithTrailingIcon: Story = {
  args: {
    trailingIcon: <ArrowRight />,
    children: "Continue",
  },
}

export const WithBothIcons: Story = {
  args: {
    leadingIcon: <PlusIcon />,
    trailingIcon: <ArrowRight />,
    children: "Add and proceed",
  },
}

/**
 * Figma parity story (JES-95, batch D).
 *
 * Mirrors the Figma `Lead UI - Button` page (component symbol
 * 29:67711). Per the existing Code Connect mapping
 * (Button.figma.tsx), Figma's documented properties are:
 *
 *   - Variant (VARIANT): Default, Secondary, Destructive, Outline, Ghost, Link
 *   - Size    (VARIANT): default, icon, sm, lg
 *   - State   (VARIANT): Default, Hover, Focus, Loading, Disabled, Pressed
 *   - Button Text (TEXT)
 *
 * Lead's `<Button>` exposes `variant: "primary" | "secondary" |
 * "outline" | "ghost" | "danger"`, `size: "sm" | "md" | "lg"`,
 * `disabled`, and `loading`. Most variants map directly; a few naming
 * differences and one missing variant are documented below.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-67711
 *
 * **Documented non-parity exceptions:**
 *
 * 1. **Naming difference** (mapping only, not a gap):
 *    - Figma Default     → Lead variant="primary"
 *    - Figma Destructive → Lead variant="danger"
 *    Same component, different name. Code Connect mapping records
 *    this in `Button.figma.tsx`.
 *
 * 2. **Figma Variant=Link has no Lead equivalent.**
 *    - **Difference:** Figma documents a "Link" variant (text-only,
 *      underlined); Lead has no `variant="link"` prop on `<Button>`.
 *    - **Reason:** API shape — Lead's pattern is to use a styled
 *      `<a>` (or a `<Button asChild>` wrapping a router Link) for
 *      link semantics, rather than carry link styling on the Button
 *      enum. Adding `variant="link"` would conflate button and
 *      anchor semantics.
 *    - **Authority:** `Button.figma.tsx` deliberate-unmapped block.
 *    - **Resolution:** Permanent. Caller composes a link via the
 *      `asChild` slot or styles an `<a>` directly.
 *
 * 3. **Figma Size=icon has no direct Lead size value.**
 *    - **Difference:** Figma documents "icon" as a size variant
 *      (square, no text label); Lead's `<Button size>` is `sm | md |
 *      lg`. Icon-only buttons in Lead are achieved by passing only an
 *      icon as children with `size="sm"` (or applying caller styles).
 *    - **Reason:** API shape — icon-only buttons are caller
 *      composition, not a primitive size. Lead has no IconButton
 *      component today.
 *    - **Authority:** `Button.figma.tsx` deliberate-unmapped block.
 *    - **Resolution:** Permanent unless an `<IconButton>` becomes a
 *      separate API decision PR.
 *
 * 4. **Figma State=Hover/Focus/Pressed are runtime CSS states**,
 *    not React props. Same pattern as other Batch B/C exceptions.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (Variant × Size matrix)",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 16,
        background: "var(--lead-color-surface-default)",
        width: "fit-content",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--lead-color-text-muted)",
        }}
      >
        Variants × default size
      </span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="primary">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--lead-color-text-muted)",
          marginTop: 8,
        }}
      >
        Sizes × Default variant
      </span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="md">
          Medium (default)
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
      </div>

      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--lead-color-text-muted)",
          marginTop: 8,
        }}
      >
        States Lead React expresses
      </span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Button variant="primary">Default</Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
        <Button variant="primary" loading>
          Loading
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Button` (29:67711). Renders the " +
          "Variant × Size combinations Lead's React API expresses, " +
          "plus the three documented states (Default, Disabled, " +
          "Loading). Figma's Link variant and icon size, plus Hover/" +
          "Focus/Pressed runtime states, are documented non-parity " +
          "(see story header for the API-shape exceptions).",
      },
    },
  },
}
