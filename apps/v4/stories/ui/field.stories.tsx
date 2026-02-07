import type { Meta, StoryObj } from "@storybook/react"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/registry/new-york-v4/ui/field"

const meta: Meta<typeof Field> = {
  title: "UI/Field",
  component: Field,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Field>

export const Default: Story = {
  render: () => (
    <Field className="w-[320px]">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <input
        id="email"
        type="email"
        placeholder="you@example.com"
        className="border-input bg-background h-9 rounded-md border px-3 text-sm"
      />
    </Field>
  ),
}

export const WithError: Story = {
  render: () => (
    <Field className="w-[320px]" data-invalid="true">
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <input
        id="password"
        type="password"
        className="border-input bg-background h-9 rounded-md border px-3 text-sm"
      />
      <FieldError>Password must be at least 8 characters.</FieldError>
    </Field>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal">
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <input
        id="name"
        placeholder="Enter your name"
        className="border-input bg-background h-9 w-[200px] rounded-md border px-3 text-sm"
      />
    </Field>
  ),
}

export const FieldGroupExample: Story = {
  name: "Field Group",
  render: () => (
    <FieldSet className="w-[420px]">
      <FieldLegend>Account Details</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="fg-name">Full Name</FieldLabel>
          <input
            id="fg-name"
            placeholder="John Doe"
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          />
        </Field>
        <FieldSeparator />
        <Field>
          <FieldLabel htmlFor="fg-email">Email</FieldLabel>
          <input
            id="fg-email"
            type="email"
            placeholder="john@example.com"
            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
          />
          <FieldDescription>
            We&apos;ll never share your email with anyone.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}
