import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Separator,
} from "@leadbank/ui"

import "./examples.css"

const meta: Meta = {
  title: "Examples/Signup Form",
  parameters: {
    docs: {
      description: {
        component:
          "End-to-end example: an account-creation form composed from Field/Label/Input, FieldDescription, FieldError, Checkbox, Card, Button. Demonstrates the Field family's id and aria-describedby wiring across a real layout, including a deliberately-invalid password field.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Card className="lead-Example lead-Example--narrow">
      <CardHeader>
        <CardTitle level={2}>Create your Lead account</CardTitle>
        <CardDescription>
          You'll use this email and password to sign in.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel required>Full name</FieldLabel>
              <FieldControl>
                <Input placeholder="Jane Doe" autoComplete="name" />
              </FieldControl>
            </Field>

            <Field>
              <FieldLabel required>Work email</FieldLabel>
              <FieldDescription>
                We'll only use this for sign-in and password resets.
              </FieldDescription>
              <FieldControl>
                <Input
                  type="email"
                  placeholder="you@lead.example"
                  autoComplete="email"
                />
              </FieldControl>
            </Field>

            <Field invalid>
              <FieldLabel required>Password</FieldLabel>
              <FieldDescription>At least 12 characters.</FieldDescription>
              <FieldControl>
                <Input
                  type="password"
                  defaultValue="abc"
                  autoComplete="new-password"
                />
              </FieldControl>
              <FieldError>Password must be at least 12 characters.</FieldError>
            </Field>

            <Field>
              <div className="lead-Example__row lead-Example__row--start">
                <FieldControl>
                  <Checkbox />
                </FieldControl>
                <div className="lead-Example__row__text" style={{ flex: 1 }}>
                  <FieldLabel>Subscribe to product updates</FieldLabel>
                  <FieldDescription>
                    Roughly one short email per month, no marketing.
                  </FieldDescription>
                </div>
              </div>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter align="between">
        <Button variant="ghost">Sign in instead</Button>
        <Button type="submit">Create account</Button>
      </CardFooter>
    </Card>
  ),
}

export const Loading: Story = {
  render: () => (
    <Card className="lead-Example lead-Example--narrow">
      <CardHeader>
        <CardTitle level={2}>Create your Lead account</CardTitle>
        <CardDescription>Submitting…</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <FieldGroup>
          <Field disabled>
            <FieldLabel required>Work email</FieldLabel>
            <FieldControl>
              <Input
                type="email"
                defaultValue="you@lead.example"
                autoComplete="email"
              />
            </FieldControl>
          </Field>
          <Field disabled>
            <FieldLabel required>Password</FieldLabel>
            <FieldControl>
              <Input type="password" defaultValue="••••••••••••" />
            </FieldControl>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter align="end">
        <Button loading>Create account</Button>
      </CardFooter>
    </Card>
  ),
}
