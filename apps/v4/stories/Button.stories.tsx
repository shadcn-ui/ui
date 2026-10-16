import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ArrowUp, Check, Plus, Search } from "lucide-react"
import { fn } from "storybook/test"

import { Button as ShadcnButton } from "../registry/new-york-v4/ui/button"

const icons = {
  "arrow-up": ArrowUp,
  check: Check,
  plus: Plus,
  search: Search,
} as const

type IconName = "none" | keyof typeof icons
type ButtonPlaygroundProps = Omit<
  ComponentProps<typeof ShadcnButton>,
  "children"
> & {
  label: string
  icon: IconName
  iconPosition: "start" | "end"
}

function ButtonPlayground({
  label,
  icon,
  iconPosition,
  loading,
  size,
  ...buttonProps
}: ButtonPlaygroundProps) {
  const iconOnly = size?.startsWith("icon") ?? false
  const Icon = loading
    ? undefined
    : icon === "none"
      ? iconOnly
        ? ArrowUp
        : undefined
      : icons[icon]

  return (
    <ShadcnButton
      {...buttonProps}
      loading={loading}
      size={size}
      aria-label={iconOnly ? label : buttonProps["aria-label"]}
    >
      {Icon && iconPosition === "start" ? <Icon aria-hidden="true" /> : null}
      {iconOnly ? null : label}
      {Icon && iconPosition === "end" ? <Icon aria-hidden="true" /> : null}
    </ShadcnButton>
  )
}

const meta = {
  title: "Shadcn/Components/Button",
  component: ButtonPlayground,
  args: {
    label: "Button",
    variant: "default",
    size: "default",
    loading: false,
    disabled: false,
    icon: "none",
    iconPosition: "start",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: {
        type: "select",
        labels: { default: "primary" },
      },
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
    loading: { control: "boolean" },
    label: { control: "text" },
    disabled: { control: "boolean" },
    icon: {
      control: "select",
      options: ["none", "arrow-up", "check", "plus", "search"],
    },
    iconPosition: { control: "inline-radio", options: ["start", "end"] },
    onClick: { control: false },
  },
} satisfies Meta<typeof ButtonPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
