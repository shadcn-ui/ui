import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@leadbank/ui"

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead radio group built on @radix-ui/react-radio-group. Supports controlled and uncontrolled value, disabled, and three sizes propagated to items via context (overridable per-item).",
      },
    },
    layout: "padded",
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  args: { size: "md" },
}

export default meta

type Story = StoryObj<typeof RadioGroup>

function plans(size?: "sm" | "md" | "lg") {
  return (
    <RadioGroup aria-label="plan" defaultValue="pro" size={size}>
      <RadioRow value="free" label="Free" description="$0 / mo" />
      <RadioRow value="pro" label="Pro" description="$12 / mo" />
      <RadioRow value="enterprise" label="Enterprise" description="Talk to us" />
    </RadioGroup>
  )
}

function RadioRow({
  value,
  label,
  description,
}: {
  value: string
  label: string
  description: string
}) {
  const id = `plan-${value}`
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--lead-space-3)",
      }}
    >
      <RadioGroupItem id={id} value={value} aria-label={label} />
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--lead-font-family-sans)",
          fontSize: "var(--lead-font-size-md)",
          color: "var(--lead-color-text-default)",
        }}
      >
        <strong>{label}</strong>{" "}
        <span style={{ color: "var(--lead-color-text-muted)" }}>
          — {description}
        </span>
      </label>
    </div>
  )
}

export const ThreeOptions: Story = {
  name: "Three options",
  render: () => plans("md"),
}

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lead-space-4)",
      }}
    >
      {plans("sm")}
      {plans("md")}
      {plans("lg")}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup aria-label="plan" disabled defaultValue="free">
      <RadioRow value="free" label="Free" description="$0 / mo" />
      <RadioRow value="pro" label="Pro" description="$12 / mo" />
    </RadioGroup>
  ),
}

export const InFieldWithError: Story = {
  name: "In Field with error",
  render: () => (
    <Field invalid>
      <FieldGroup>
        <FieldLabel required>Plan</FieldLabel>
        <FieldDescription>Pick the tier that fits your team.</FieldDescription>
        {plans("md")}
        <FieldError>Pick a plan to continue.</FieldError>
      </FieldGroup>
    </Field>
  ),
}

/**
 * Figma parity story (JES-93, batch B).
 *
 * Mirrors the Figma `Lead UI - Radio Group / Item` (item symbol
 * 29:97236). Per the existing Code Connect mapping
 * (RadioGroup.figma.tsx), Figma's documented item properties are:
 *
 *   - Active (VARIANT): Off, On
 *   - Type   (VARIANT): Default, Box
 *   - Font Weight (VARIANT): Medium, Regular
 *   - State  (VARIANT): Default, Focus
 *
 * Lead's `<RadioGroupItem>` exposes `value` (required identifier),
 * `disabled`, and inherits `checked` state from the parent
 * `<RadioGroup>` value/defaultValue. No item-level `Type`, `Font
 * Weight`, or `State` props.
 *
 * Source:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=29-97236
 *
 * **Documented non-parity exception:**
 *
 * - **Difference:** Figma exposes `Type=Box` (boxed item layout) and
 *   `Font Weight=Medium|Regular` as variants on the item; Lead has
 *   neither as a React prop on `<RadioGroupItem>`.
 * - **Reason:** API shape — label typography is a caller styling
 *   concern via the surrounding `<Label>` / `<Field>` composition,
 *   not an item-level prop. The `Type=Box` boxed visual is a
 *   stylistic alternate not adopted as Lead's canonical look.
 * - **Authority:** `RadioGroup.figma.tsx` deliberate-unmapped block;
 *   the group-root Figma node `29:97178` is also intentionally
 *   unmapped in that file (no clean mapping target).
 * - **Resolution:** Permanent. Item layout/typography variants are
 *   caller composition concerns.
 *
 * Parity standard: docs/storybook-figma-parity-standard.md.
 */
export const FigmaParity: Story = {
  name: "Figma parity (Active On/Off + Disabled)",
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
        Default group
      </span>
      <RadioGroup defaultValue="active">
        <Field orientation="horizontal">
          <RadioGroupItem id="parity-inactive" value="inactive" />
          <Label htmlFor="parity-inactive">Active=Off (Inactive)</Label>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem id="parity-active" value="active" />
          <Label htmlFor="parity-active">Active=On (selected)</Label>
        </Field>
      </RadioGroup>

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
        Disabled group
      </span>
      <RadioGroup defaultValue="active2" disabled>
        <Field orientation="horizontal">
          <RadioGroupItem id="parity-inactive-disabled" value="inactive2" />
          <Label htmlFor="parity-inactive-disabled">Active=Off, disabled</Label>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem id="parity-active-disabled" value="active2" />
          <Label htmlFor="parity-active-disabled">Active=On, disabled</Label>
        </Field>
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors Figma `Lead UI - Radio Group / Item` (29:97236). " +
          "Renders the Active × Disabled combinations Lead's React " +
          "API expresses. Figma's Type=Box and Font Weight variants " +
          "are not Lead props (see story header for the documented " +
          "non-parity exception); label typography and item layout " +
          "are caller composition concerns.",
      },
    },
  },
}
