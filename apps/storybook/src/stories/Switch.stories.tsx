import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel,
  Switch,
} from "@leadbank/ui"

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead toggle switch built on @radix-ui/react-switch. Supports controlled and uncontrolled checked state, plus disabled. Three sizes via Lead CSS variables.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  args: { size: "md" },
}

export default meta

type Story = StoryObj<typeof Switch>

export const Standalone: Story = {
  render: (args) => <Switch aria-label="notifications" {...args} />,
}

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--lead-space-4)",
        alignItems: "center",
      }}
    >
      <Switch aria-label="sm" size="sm" defaultChecked />
      <Switch aria-label="md" size="md" defaultChecked />
      <Switch aria-label="lg" size="lg" defaultChecked />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "var(--lead-space-4)",
        alignItems: "center",
      }}
    >
      <Switch aria-label="off" disabled />
      <Switch aria-label="on" disabled defaultChecked />
    </div>
  ),
}

export const WithFieldAndLabel: Story = {
  name: "With Field + Label",
  render: () => (
    <Field>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--lead-space-3)",
          width: 360,
        }}
      >
        <FieldLabel>Email notifications</FieldLabel>
        <FieldControl>
          <Switch defaultChecked />
        </FieldControl>
      </div>
      <FieldDescription>
        Get a weekly summary of activity in your workspace.
      </FieldDescription>
    </Field>
  ),
}

/**
 * Figma parity story (JES-93, batch B).
 *
 * Mirrors the Figma `Lead UI - Switch` page (component symbol
 * 29:103697). Per the existing Code Connect mapping
 * (Switch.figma.tsx), Figma's documented properties are:
 *
 *   - Active (VARIANT): Off, On
 *   - Type   (VARIANT): Default, Box
 *   - Side   (VARIANT): Left, Right
 *   - State  (VARIANT): Default, Focus
 *
 * Lead's `<Switch>` exposes `checked` (mapped from Active) and
 * `disabled`. Figma's Type, Side, and State variants describe label
 * placement and runtime states that aren't surfaced as React props.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-103697
 *
 * **Documented non-parity exception:**
 *
 * - **Difference:** Figma exposes `Type=Box` (filled track) and
 *   `Side=Left|Right` (label placement) as variants; Lead has no
 *   `type` prop and no built-in label-placement prop on `<Switch>`.
 * - **Reason:** API shape — Lead's `<Switch>` is a non-labeled
 *   primitive; label placement is a caller composition concern using
 *   `<Field>` / `<Label>` (or none). The `Type=Box` visual is a
 *   stylistic alternate Lead has not adopted; switch-as-pill is the
 *   canonical Lead visual.
 * - **Authority:** `Switch.figma.tsx` deliberate-unmapped block.
 * - **Resolution:** Permanent. If a `Type=Box` switch becomes a
 *   product requirement, that's a separate API decision PR.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (Active On/Off + Disabled)",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto",
        gap: "12px 24px",
        alignItems: "center",
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
        Figma state
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--lead-color-text-muted)",
        }}
      >
        Lead switch
      </span>

      <span style={{ fontSize: 13 }}>Active=Off (default)</span>
      <Switch />

      <span style={{ fontSize: 13 }}>Active=On (default)</span>
      <Switch defaultChecked />

      <span style={{ fontSize: 13 }}>Active=Off (disabled)</span>
      <Switch disabled />

      <span style={{ fontSize: 13 }}>Active=On (disabled)</span>
      <Switch defaultChecked disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Switch` (29:103697). Renders the " +
          "Active × Disabled combinations Lead's React API expresses. " +
          "Figma's Type=Box and Side=Left|Right variants are not Lead " +
          "props (see story header for the documented non-parity " +
          "exception); label placement is caller composition.",
      },
    },
  },
}
