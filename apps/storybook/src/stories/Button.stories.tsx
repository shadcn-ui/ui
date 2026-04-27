import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "@leadbank/ui"

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead Button. Variants for primary/secondary/outline/ghost/danger, three sizes, plus disabled and loading states. Internal data-* state attributes cannot be overridden by callers.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "ghost", "danger"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: "primary" },
}

export const Secondary: Story = {
  args: { variant: "secondary" },
}

export const Outline: Story = {
  args: { variant: "outline" },
}

export const Ghost: Story = {
  args: { variant: "ghost" },
}

export const Danger: Story = {
  args: { variant: "danger" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const Medium: Story = {
  args: { size: "md" },
}

export const Large: Story = {
  args: { size: "lg" },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Loading: Story = {
  args: { loading: true },
}

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: <PlusIcon />,
    children: "New item",
  },
}

export const WithTrailingIcon: Story = {
  args: {
    trailingIcon: <ArrowRight />,
    children: "Continue",
  },
}

export const WithBothIcons: Story = {
  args: {
    leadingIcon: <PlusIcon />,
    trailingIcon: <ArrowRight />,
    children: "Add and proceed",
  },
}
