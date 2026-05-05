import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from "@leadbank/ui"

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead skeleton placeholder for loading content. Three shapes (`text`, `rect`, `circle`) and a shimmer animation. Decorative by default (`role='none'`, `aria-hidden=true`) — pair the placeholder with a parent that announces the loading state.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    shape: { control: { type: "select" }, options: ["text", "rect", "circle"] },
    decorative: { control: "boolean" },
  },
  args: { shape: "rect", decorative: true },
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Shapes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--lead-space-3)",
        alignItems: "center",
      }}
    >
      <Skeleton shape="circle" style={{ width: 48, height: 48 }} />
      <Skeleton shape="rect" style={{ width: 160, height: 32 }} />
      <Skeleton shape="text" style={{ width: 200 }} />
    </div>
  ),
}

export const TextLines: Story = {
  name: "Text lines",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lead-space-2)",
        width: 360,
      }}
    >
      <Skeleton shape="text" style={{ width: "60%" }} />
      <Skeleton shape="text" />
      <Skeleton shape="text" />
      <Skeleton shape="text" style={{ width: "85%" }} />
    </div>
  ),
}

export const InCardLoadingState: Story = {
  name: "In a Card (loading state)",
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
          <Skeleton shape="circle" style={{ width: 36, height: 36 }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              flex: 1,
            }}
          >
            <Skeleton shape="text" style={{ width: "40%" }} />
            <Skeleton shape="text" style={{ width: "70%", height: 12 }} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton shape="text" />
        <Skeleton shape="text" />
        <Skeleton shape="text" style={{ width: "85%" }} />
      </CardContent>
    </Card>
  ),
}

export const Semantic: Story = {
  name: "Semantic (aria-live region)",
  render: () => (
    <Skeleton
      decorative={false}
      aria-label="Loading user profile"
      style={{ width: 200, height: 24 }}
    />
  ),
}

/**
 * Figma parity story (JES-92, batch A).
 *
 * Mirrors the Figma `Lead UI - Skeleton` page (component symbol
 * 29:103198). Figma documents three Variant values:
 *   - Default — generic loading content (header + body)
 *   - Card    — avatar + 2 text bars (single-element preview composition)
 *   - Text    — multiple text bars
 *
 * Lead's `<Skeleton>` ships three shape primitives (`text` / `rect` /
 * `circle`). The Figma "Default" and "Card" variants are caller-side
 * compositions of multiple skeletons, not single shape values. This
 * story renders each Figma variant using compositional patterns of
 * Lead's primitives.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-103198
 *
 * **Documented non-parity exception:**
 *
 * - **Difference:** Figma exposes "Default" and "Card" as single
 *   variant values; Lead exposes only `text`/`rect`/`circle` shape
 *   primitives.
 * - **Reason:** API shape — see `Skeleton.figma.tsx` Code Connect
 *   mapping. Adding `variant="card"` to `<Skeleton>` would mean
 *   either (a) bundling a fixed avatar+text layout into the
 *   primitive (constrains caller), or (b) adding a parallel
 *   composition API (duplicate surface).
 * - **Authority:** `Skeleton.figma.tsx` deliberate-unmapped block;
 *   `docs/storybook-figma-parity-inventory.md` row.
 * - **Resolution:** Figma's Default/Card patterns are documented
 *   here as caller-side compositions, not as production prop
 *   additions. No follow-up.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (Default / Card / Text compositions)",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 24,
        padding: 16,
        background: "var(--lead-color-surface-default)",
      }}
    >
      {/* Figma Variant=Card — avatar + 2 text bars, composition of 3 Skeletons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span
          style={{
            fontSize: 11,
            color: "var(--lead-color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Variant=Card
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Skeleton shape="circle" style={{ width: 40, height: 40 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <Skeleton shape="text" style={{ width: "80%" }} />
            <Skeleton shape="text" style={{ width: "60%" }} />
          </div>
        </div>
      </div>

      {/* Figma Variant=Default — header bars + large body block */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span
          style={{
            fontSize: 11,
            color: "var(--lead-color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Variant=Default
        </span>
        <Skeleton shape="text" style={{ width: "100%" }} />
        <Skeleton shape="text" style={{ width: "80%" }} />
        <Skeleton shape="rect" style={{ width: "100%", height: 160 }} />
      </div>

      {/* Figma Variant=Text — multiple text bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span
          style={{
            fontSize: 11,
            color: "var(--lead-color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Variant=Text
        </span>
        <Skeleton shape="text" style={{ width: "100%" }} />
        <Skeleton shape="text" style={{ width: "70%" }} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Skeleton` (29:103198). All three " +
          "Figma Variants rendered as caller-side compositions of " +
          "Lead's `text`/`rect`/`circle` shape primitives. The " +
          "single-prop `Default`/`Card` Figma variants don't have " +
          "1:1 React equivalents — see story header for the " +
          "documented non-parity exception (API shape).",
      },
    },
  },
}
