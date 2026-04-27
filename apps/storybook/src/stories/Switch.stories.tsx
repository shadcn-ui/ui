import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel,
  Switch,
} from "@leadbank/ui"

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead toggle switch built on @radix-ui/react-switch. Supports controlled and uncontrolled checked state, plus disabled. Three sizes via Lead CSS variables.",
      },
    },
    layout: "padded",
  },
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  args: { size: "md" },
}

export default meta

type Story = StoryObj<typeof Switch>

export const Standalone: Story = {
  render: (args) => <Switch aria-label="notifications" {...args} />,
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
      <Switch aria-label="sm" size="sm" defaultChecked />
      <Switch aria-label="md" size="md" defaultChecked />
      <Switch aria-label="lg" size="lg" defaultChecked />
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
      <Switch aria-label="off" disabled />
      <Switch aria-label="on" disabled defaultChecked />
    </div>
  ),
}

export const WithFieldAndLabel: Story = {
  name: "With Field + Label",
  render: () => (
    <Field>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--lead-space-3)",
          width: 360,
        }}
      >
        <FieldLabel>Email notifications</FieldLabel>
        <FieldControl>
          <Switch defaultChecked />
        </FieldControl>
      </div>
      <FieldDescription>
        Get a weekly summary of activity in your workspace.
      </FieldDescription>
    </Field>
  ),
}
