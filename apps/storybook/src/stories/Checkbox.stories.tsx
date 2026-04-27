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
