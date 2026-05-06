import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import {
  Checkbox,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@leadbank/ui"

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead checkbox built on @radix-ui/react-checkbox. Supports controlled and uncontrolled checked state, indeterminate, disabled, and invalid. Three sizes via Lead CSS variables.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  args: { size: "md" },
}

export default meta

type Story = StoryObj<typeof Checkbox>

export const Standalone: Story = {
  render: (args) => <Checkbox aria-label="agree" {...args} />,
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
      <Checkbox aria-label="sm" size="sm" defaultChecked />
      <Checkbox aria-label="md" size="md" defaultChecked />
      <Checkbox aria-label="lg" size="lg" defaultChecked />
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
      <Checkbox aria-label="off" disabled />
      <Checkbox aria-label="on" disabled defaultChecked />
    </div>
  ),
}

export const Invalid: Story = {
  args: { invalid: true },
  render: (args) => <Checkbox aria-label="agree" {...args} />,
}

export const Indeterminate: Story = {
  render: () => {
    function Wrap() {
      const [checked, setChecked] = useState<boolean | "indeterminate">(
        "indeterminate"
      )
      return (
        <Checkbox
          aria-label="select all"
          checked={checked}
          onCheckedChange={setChecked}
        />
      )
    }
    return <Wrap />
  },
}

export const WithFieldAndLabel: Story = {
  name: "With Field + Label",
  render: () => (
    <Field>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--lead-space-3)",
        }}
      >
        <FieldControl>
          <Checkbox />
        </FieldControl>
        <FieldLabel>Subscribe to product updates</FieldLabel>
      </div>
      <FieldDescription>
        We send at most one email per month.
      </FieldDescription>
    </Field>
  ),
}

export const InvalidWithError: Story = {
  name: "Invalid with FieldError",
  render: () => (
    <Field invalid>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--lead-space-3)",
        }}
      >
        <FieldControl>
          <Checkbox invalid />
        </FieldControl>
        <FieldLabel required>Accept the terms</FieldLabel>
      </div>
      <FieldError>You must accept the terms to continue.</FieldError>
    </Field>
  ),
}

/**
 * Figma parity story (JES-93, batch B).
 *
 * Mirrors the Figma `Lead UI - Checkbox` page (component symbol
 * 29:85556). Per the existing Code Connect mapping
 * (Checkbox.figma.tsx), Figma's documented properties are:
 *
 *   - Status (VARIANT): Inactive, Active
 *   - State  (VARIANT): Default, Focus, Disabled, Pressed
 *
 * Lead's `<Checkbox>` exposes `checked` (mapped from Figma's Status),
 * `disabled` (mapped from State=Disabled), plus an `indeterminate`
 * state that has no Figma counterpart and a Radix-driven `Focus` state
 * that's runtime/CSS-driven rather than a React prop.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-85556
 *
 * **Documented non-parity exception:**
 *
 * - **Difference:** Figma exposes `State=Focus` and `State=Pressed` as
 *   variant values; Lead does not expose either as a React prop.
 * - **Reason:** API shape — focus and pressed are runtime UI states
 *   driven by browser focus management and `:active` CSS pseudo-class
 *   respectively. Promoting them to React props would conflict with
 *   Radix's focus-trap behavior and add no value over CSS.
 * - **Authority:** `Checkbox.figma.tsx` deliberate-unmapped block.
 * - **Resolution:** Permanent. State=Focus/Pressed visual treatment
 *   is shipped via Lead's CSS (`:focus-visible`, `:active`), not via
 *   parallel React props.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (Status + State)",
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
        Lead checkbox
      </span>

      <span style={{ fontSize: 13 }}>Status=Inactive (default)</span>
      <Checkbox />

      <span style={{ fontSize: 13 }}>Status=Active (default)</span>
      <Checkbox defaultChecked />

      <span style={{ fontSize: 13 }}>State=Disabled (Inactive)</span>
      <Checkbox disabled />

      <span style={{ fontSize: 13 }}>State=Disabled (Active)</span>
      <Checkbox defaultChecked disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Checkbox` (29:85556). Renders the " +
          "Status × State combinations Lead's React API expresses: " +
          "Inactive/Active × Default/Disabled. Figma's State=Focus " +
          "and State=Pressed are runtime CSS states (see story header " +
          "for the documented non-parity exception).",
      },
    },
  },
}
