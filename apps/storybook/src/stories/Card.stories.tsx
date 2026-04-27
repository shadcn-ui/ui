import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldControl,
  FieldGroup,
  FieldLabel,
  Input,
  Separator,
} from "@leadbank/ui"

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Card is a layout container with semantic subcomponents for header, title, description, content, and footer. Padding and variant are configurable; subcomponents are unstyled-by-default and compose freely.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    padding: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg"],
    },
    variant: {
      control: { type: "select" },
      options: ["default", "muted", "outline"],
    },
  },
  args: {
    padding: "md",
    variant: "default",
  },
}

export default meta

type Story = StoryObj<typeof Card>

export const Basic: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your account details.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the body of the card.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooterActions: Story = {
  name: "With footer actions",
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Delete account</CardTitle>
        <CardDescription>This action is permanent.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>All your data will be removed within 30 days.</p>
      </CardContent>
      <CardFooter align="end">
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </CardFooter>
    </Card>
  ),
}

export const FormCard: Story = {
  name: "Form card",
  render: (args) => (
    <Card {...args} style={{ width: 400 }}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Use your work email to access the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel required>Email</FieldLabel>
            <FieldControl>
              <Input type="email" placeholder="you@lead.example" />
            </FieldControl>
          </Field>
          <Field>
            <FieldLabel required>Password</FieldLabel>
            <FieldControl>
              <Input type="password" placeholder="••••••••" />
            </FieldControl>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter align="between">
        <Button variant="ghost">Forgot password</Button>
        <Button>Sign in</Button>
      </CardFooter>
    </Card>
  ),
}

export const MutedVariant: Story = {
  name: "Muted variant",
  args: { variant: "muted" },
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle level={4}>Tip</CardTitle>
        <CardDescription>You can switch teams in settings.</CardDescription>
      </CardHeader>
    </Card>
  ),
}

export const OutlineVariant: Story = {
  name: "Outline variant",
  args: { variant: "outline" },
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle level={4}>Outline card</CardTitle>
        <CardDescription>Transparent background.</CardDescription>
      </CardHeader>
    </Card>
  ),
}

export const WithSeparator: Story = {
  name: "With separator between sections",
  render: (args) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <p>Account preferences live here.</p>
      </CardContent>
      <Separator />
      <CardFooter align="end">
        <Button variant="outline">Save</Button>
      </CardFooter>
    </Card>
  ),
}
