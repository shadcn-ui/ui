import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
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
