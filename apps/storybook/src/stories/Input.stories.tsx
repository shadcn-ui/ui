import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "@leadbank/ui"

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead text input. Three sizes, default and error variants, plus disabled and invalid states. Internal data-* state attributes cannot be overridden by callers.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "error"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "search", "url"],
    },
  },
  args: {
    placeholder: "you@example.com",
    "aria-label": "email",
    variant: "default",
    size: "md",
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Input {...args} />
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof Input>

export const Default: Story = {}

export const Small: Story = {
  args: { size: "sm" },
}

export const Medium: Story = {
  args: { size: "md" },
}

export const Large: Story = {
  args: { size: "lg" },
}

export const ErrorVariant: Story = {
  name: "Error variant",
  args: { variant: "error" },
}

export const Invalid: Story = {
  args: { invalid: true },
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Disabled" },
}

export const Email: Story = {
  args: { type: "email", placeholder: "name@lead.example" },
}

export const Password: Story = {
  args: { type: "password", placeholder: "••••••••" },
}

/**
 * Figma parity story (JES-93, batch B).
 *
 * Mirrors the Figma `Lead UI - Input` page (component symbol
 * 29:95030). Per the existing Code Connect mapping
 * (Input.figma.tsx), Figma's documented properties are:
 *
 *   - Variant (VARIANT): Default, File
 *   - State   (VARIANT): Default, Focus, Filled, Disabled, Error, Error Focus
 *
 * Lead's `<Input>` maps `placeholder`, `disabled`, and `invalid`
 * directly; the State enum's `Focus`/`Filled`/`Error Focus` values
 * are runtime states (focus-driven, value-driven), not React props.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-95030
 *
 * **Documented non-parity exception:**
 *
 * - **Difference:** Figma exposes `Variant=File` (file-input visual)
 *   and `State=Focus`/`Filled`/`Error Focus` as variants; Lead has
 *   no `<Input variant="file">` prop and treats Focus/Filled as
 *   runtime CSS states (`:focus-visible`, value-driven).
 * - **Reason:** API shape — file inputs in Lead are a separate
 *   primitive concern (caller passes `type="file"` to the underlying
 *   `<input>`); a dedicated `variant="file"` would either duplicate
 *   that surface or constrain the caller. Focus/Filled visual
 *   treatment ships via CSS, not React props.
 * - **Authority:** `Input.figma.tsx` deliberate-unmapped block.
 * - **Resolution:** Permanent for runtime states. File inputs can
 *   be added as a separate API decision PR if product evidence
 *   warrants.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (Default / Filled / Disabled / Error)",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 240px",
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
        Lead input
      </span>

      <span style={{ fontSize: 13 }}>State=Default (placeholder)</span>
      <Input placeholder="Enter your email" />

      <span style={{ fontSize: 13 }}>State=Filled (value)</span>
      <Input defaultValue="user@example.com" />

      <span style={{ fontSize: 13 }}>State=Disabled</span>
      <Input placeholder="Disabled" disabled />

      <span style={{ fontSize: 13 }}>State=Error</span>
      <Input placeholder="Invalid input" invalid defaultValue="bad-email" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Input` (29:95030). Renders the " +
          "State variants Lead's React API expresses: Default " +
          "(placeholder), Filled (value), Disabled, Error. Figma's " +
          "Variant=File and runtime Focus states are documented " +
          "non-parity (see story header for the API-shape exception).",
      },
    },
  },
}
