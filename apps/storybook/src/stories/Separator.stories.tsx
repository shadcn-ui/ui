import type { Meta, StoryObj } from "@storybook/react-vite"
import { Separator } from "@leadbank/ui"

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A 1px divider for visual or semantic separation. Decorative by default (`role='none'`); set `decorative={false}` to expose it as a semantic separator with `role='separator'` and `aria-orientation`.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
    variant: {
      control: { type: "select" },
      options: ["default", "strong"],
    },
    decorative: { control: "boolean" },
  },
  args: {
    orientation: "horizontal",
    variant: "default",
    decorative: true,
  },
}

export default meta

type Story = StoryObj<typeof Separator>

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <div
      style={{
        width: 360,
        fontFamily: "var(--lead-font-family-sans)",
        color: "var(--lead-color-text-default)",
      }}
    >
      <p style={{ margin: 0 }}>Section above</p>
      <Separator {...args} style={{ margin: "var(--lead-space-3) 0" }} />
      <p style={{ margin: 0 }}>Section below</p>
    </div>
  ),
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--lead-space-3)",
        height: 32,
        fontFamily: "var(--lead-font-family-sans)",
        color: "var(--lead-color-text-default)",
      }}
    >
      <span>Left</span>
      <Separator {...args} />
      <span>Middle</span>
      <Separator {...args} />
      <span>Right</span>
    </div>
  ),
}

export const Strong: Story = {
  args: { variant: "strong" },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Separator {...args} />
    </div>
  ),
}

export const SemanticSeparator: Story = {
  name: "Semantic (decorative=false)",
  args: { decorative: false, "aria-label": "section break" },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Separator {...args} />
    </div>
  ),
}

/**
 * Figma parity story (JES-92, batch A).
 *
 * Mirrors the Figma `Lead UI - Separator` page (component symbol
 * 29:98862). The Figma source documents two orientations: horizontal
 * (full-width hairline) and vertical (full-height hairline).
 *
 * Lead's `<Separator>` renders a single role="separator" div with a
 * 1px hairline using the `--lead-color-border-default` token. The
 * orientation prop is a 1:1 mapping with Figma's `Orientation`
 * variant — no exceptions.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-98862
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (horizontal + vertical)",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: 16,
        background: "var(--lead-color-surface-default)",
      }}
    >
      <div style={{ width: 320 }}>
        <Separator orientation="horizontal" />
      </div>
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Separator orientation="vertical" style={{ height: "100%" }} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Separator` (29:98862). Horizontal " +
          "and vertical orientations rendered with their canonical " +
          "Lead `<Separator>` props. No documented non-parity " +
          "exceptions — Figma's `Orientation` variant maps 1:1 to " +
          "Lead's `orientation` prop.",
      },
    },
  },
}
