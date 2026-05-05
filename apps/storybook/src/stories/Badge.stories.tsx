import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@leadbank/ui"

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead status/label badge. Renders as a non-interactive `<span>`. Five variants and three sizes via Lead CSS variables; optional leading dot for status indicators.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["neutral", "brand", "success", "warning", "danger"],
    },
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    dot: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Badge",
    variant: "neutral",
    size: "md",
  },
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--lead-space-2)",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="brand">Brand</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--lead-space-3)",
        alignItems: "center",
      }}
    >
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
}

export const WithDot: Story = {
  name: "Status dots",
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--lead-space-2)",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Badge variant="success" dot>
        Live
      </Badge>
      <Badge variant="warning" dot>
        Degraded
      </Badge>
      <Badge variant="danger" dot>
        Down
      </Badge>
      <Badge variant="neutral" dot>
        Offline
      </Badge>
    </div>
  ),
}

export const InCardContext: Story = {
  name: "In a Card",
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--lead-space-3)",
          }}
        >
          <CardTitle level={3}>Production deployment</CardTitle>
          <Badge variant="success" dot>
            Live
          </Badge>
        </div>
        <CardDescription>Last shipped 14 minutes ago.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: "flex", gap: "var(--lead-space-2)" }}>
          <Badge variant="brand" size="sm">
            v4.2.1
          </Badge>
          <Badge variant="neutral" size="sm">
            us-east-1
          </Badge>
        </div>
      </CardContent>
    </Card>
  ),
}

/**
 * Figma parity story (JES-92, batch A).
 *
 * Mirrors the Figma `Lead UI - Badge` page (component symbol
 * 29:66938). Figma documents five Variant values (Default, Secondary,
 * Outline, Destructive, Verified). Lead's `<Badge>` ships five
 * variants (neutral, brand, success, warning, danger) — different
 * names, mostly overlapping semantics. The Code Connect mapping
 * (`Badge.figma.tsx`) records the variant translations.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-66938
 *
 * Mapped surfaces:
 *   - Figma Variant=Default     → Lead variant="neutral"
 *   - Figma Variant=Secondary   → Lead variant="brand"
 *   - Figma Variant=Destructive → Lead variant="danger"
 *   - Figma Variant=Verified    → Lead variant="success" + check icon
 *   - Figma "Badge Text"        → <Badge> children
 *
 * **Documented non-parity exception:**
 *
 * - **Difference:** Figma's `Outline` variant has no Lead React
 *   equivalent.
 * - **Reason:** API shape — adding `variant="outline"` to `<Badge>`
 *   would expand the variant enum without a clear product use case
 *   surfaced by Lead-built apps. The experimental export
 *   (`Experimental / Figma Export / Badge`) renders Outline as a
 *   Storybook-local approximation and explicitly labels it as not a
 *   production pattern.
 * - **Authority:** `Badge.figma.tsx` Code Connect mapping;
 *   `docs/storybook-figma-parity-inventory.md` row.
 * - **Resolution:** Outline stays as an experimental approximation.
 *   If product evidence emerges that Outline is needed in production,
 *   that's a separate API decision PR.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (Default / Secondary / Destructive / Verified)",
  render: () => {
    const CheckIcon = (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ marginRight: 4 }}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
    return (
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          padding: 16,
          background: "var(--lead-color-surface-default)",
        }}
      >
        <Badge variant="neutral">Badge</Badge>
        <Badge variant="brand">Badge</Badge>
        <Badge variant="danger">Badge</Badge>
        <Badge variant="success">
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            {CheckIcon}
            Verified
          </span>
        </Badge>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Badge` (29:66938). Renders the " +
          "four Figma variants that map cleanly to Lead's React API: " +
          "Default → neutral, Secondary → brand, Destructive → danger, " +
          "Verified → success (with caller-supplied check icon). " +
          "Figma's Outline variant has no Lead equivalent and is " +
          "documented as a non-parity exception (see story header) — " +
          "it lives only in the experimental export story.",
      },
    },
  },
}
