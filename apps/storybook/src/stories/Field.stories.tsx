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

/**
 * Field — Storybook stories.
 *
 * Includes Figma-parity stories matching the source design at:
 *   https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=216-1154
 *   FieldGroup: https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=216-1155
 *
 * Parity reference: docs/storybook-figma-parity-standard.md.
 */

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

export const FigmaParityFieldVariants: Story = {
  name: "Figma parity (Field variants)",
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors the standalone Field source component created in Figma at https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=216-1154. Mapped surfaces: Orientation → `orientation`, State=Invalid → `invalid`, State=Disabled → `disabled`, and Content variants → composition of `FieldLabel`, `FieldDescription`, `FieldControl`, and `FieldError`. No documented non-parity exceptions: the Figma source was created from Lead React's compositional Field API.",
      },
    },
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gap: "var(--lead-space-6)",
        gridTemplateColumns: "repeat(2, minmax(280px, 1fr))",
        maxWidth: 900,
      }}
    >
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input type="email" placeholder="you@lead.example" />
        </FieldControl>
      </Field>

      <Field>
        <FieldLabel>Work email</FieldLabel>
        <FieldDescription>
          We'll only use this for password resets.
        </FieldDescription>
        <FieldControl>
          <Input type="email" placeholder="you@lead.example" />
        </FieldControl>
      </Field>

      <Field invalid>
        <FieldLabel>Work email</FieldLabel>
        <FieldControl>
          <Input
            type="email"
            defaultValue="not-an-email"
            placeholder="you@lead.example"
          />
        </FieldControl>
        <FieldError>Enter a valid email address.</FieldError>
      </Field>

      <Field disabled>
        <FieldLabel>Work email</FieldLabel>
        <FieldDescription>You can't edit this right now.</FieldDescription>
        <FieldControl>
          <Input type="email" defaultValue="frozen@lead.example" />
        </FieldControl>
      </Field>

      <Field orientation="horizontal" style={{ gridColumn: "1 / -1" }}>
        <FieldLabel style={{ minWidth: 96 }}>Email</FieldLabel>
        <FieldControl>
          <Input type="email" placeholder="you@lead.example" />
        </FieldControl>
      </Field>
    </div>
  ),
}

export const FigmaParityFieldGroup: Story = {
  name: "Figma parity (FieldGroup)",
  parameters: {
    docs: {
      description: {
        story:
          "Mirrors the standalone FieldGroup source component created in Figma at https://www.figma.com/design/f2gKVfCJNOS0MeLUk4CM8u/Lead-Design-System---CLI-Ready-Staging?node-id=216-1155. Mapped surfaces: FieldGroup vertical stack → `FieldGroup`, field rows → child `Field` compositions, and invalid/error state → `Field invalid` + `FieldError`. No documented non-parity exceptions.",
      },
    },
  },
  render: () => (
    <div style={{ width: 400 }}>
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
      </FieldGroup>
    </div>
  ),
}
