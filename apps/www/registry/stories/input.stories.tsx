import type { Meta, StoryObj } from "@storybook/react"

import { Input } from "@/registry/default/ui/input"

/**
 * Displays a form input field or a component that looks like an input field.
 */
const meta = {
  title: "ui/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "w-96",
    type: "email",
    placeholder: "Email",
    disabled: false,
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the input field.
 */
export const Default: Story = {}

/**
 * Use the `disabled` prop to make the input non-interactive and appears faded,
 * indicating that input is not currently accepted.
 */
export const Disabled: Story = {
  args: { disabled: true },
}

/**
 * Use the `Label` component to includes a clear, descriptive label above or
 * alongside the input area to guide users.
 */
export const WithLabel: Story = {
  render: (args) => (
    <div className="grid items-center gap-1.5">
      <label htmlFor="email">{args.placeholder}</label>
      <Input {...args} id="email" />
    </div>
  ),
}

/**
 * Use a text element below the input field to provide additional instructions
 * or information to users.
 */
export const WithHelperText: Story = {
  render: (args) => (
    <div className="grid items-center gap-1.5">
      <label htmlFor="email-2">{args.placeholder}</label>
      <Input {...args} id="email-2" />
      <p className="text-sm text-foreground/50">Enter your email address.</p>
    </div>
  ),
}

/**
 * Use the `Button` component to indicate that the input field can be submitted
 * or used to trigger an action.
 */
export const WithButton: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Input {...args} />
      <button
        className="rounded bg-primary px-4 py-2 text-primary-foreground"
        type="submit"
      >
        Subscribe
      </button>
    </div>
  ),
}
