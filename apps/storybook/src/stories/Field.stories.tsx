import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@leadbank/ui"

const meta: Meta<typeof Field> = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Field composes Label + Input + Description + Error with shared ids and accessibility wiring. FieldGroup stacks multiple fields. The Field id, aria-describedby, disabled, and invalid state propagate to descendants via context.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj<typeof Field>

export const Basic: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input type="email" placeholder="you@lead.example" />
        </FieldControl>
      </Field>
    </div>
  ),
}

export const WithDescription: Story = {
  name: "With description",
  render: () => (
    <div style={{ width: 360 }}>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldDescription>
          We'll only use this for password resets.
        </FieldDescription>
        <FieldControl>
          <Input type="email" placeholder="you@lead.example" />
        </FieldControl>
      </Field>
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Field>
        <FieldLabel required>Email</FieldLabel>
        <FieldControl>
          <Input type="email" required placeholder="you@lead.example" />
        </FieldControl>
      </Field>
    </div>
  ),
}

export const InvalidWithError: Story = {
  name: "Invalid with error",
  render: () => (
    <div style={{ width: 360 }}>
      <Field invalid>
        <FieldLabel required>Email</FieldLabel>
        <FieldDescription>We never share this.</FieldDescription>
        <FieldControl>
          <Input
            type="email"
            defaultValue="not-an-email"
            placeholder="you@lead.example"
          />
        </FieldControl>
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Field disabled>
        <FieldLabel>Email</FieldLabel>
        <FieldDescription>You can't edit this right now.</FieldDescription>
        <FieldControl>
          <Input type="email" defaultValue="frozen@lead.example" />
        </FieldControl>
      </Field>
    </div>
  ),
}

export const HorizontalLayout: Story = {
  name: "Horizontal layout",
  render: () => (
    <div style={{ width: 480 }}>
      <Field orientation="horizontal">
        <FieldLabel style={{ minWidth: 96 }}>Email</FieldLabel>
        <FieldControl>
          <Input type="email" placeholder="you@lead.example" />
        </FieldControl>
      </Field>
    </div>
  ),
}

export const FormWithFieldGroup: Story = {
  name: "Full form (FieldGroup)",
  render: () => (
    <form
      style={{ width: 400 }}
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel required>Full name</FieldLabel>
          <FieldControl>
            <Input placeholder="Jane Doe" />
          </FieldControl>
        </Field>

        <Field>
          <FieldLabel required>Email</FieldLabel>
          <FieldDescription>For login and password resets.</FieldDescription>
          <FieldControl>
            <Input type="email" placeholder="you@lead.example" />
          </FieldControl>
        </Field>

        <Field invalid>
          <FieldLabel required>Password</FieldLabel>
          <FieldControl>
            <Input type="password" defaultValue="abc" />
          </FieldControl>
          <FieldError>Password must be at least 12 characters.</FieldError>
        </Field>

        <Button type="submit">Create account</Button>
      </FieldGroup>
    </form>
  ),
}
