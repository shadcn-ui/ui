import type { Meta, StoryObj } from "@storybook/react"

import {
  Toast,
  ToastAction,
  ToastActionElement,
  ToastProps,
} from "@/registry/default/ui/toast"
import { Toaster } from "@/registry/default/ui/toaster"
import { useToast } from "@/registry/default/ui/use-toast"

/**
 * A succinct message that is displayed temporarily.
 */
const meta = {
  title: "ui/Toast",
  component: Toast,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "centered",
  },
  render: (args) => <ToastExample {...args} />,
} satisfies Meta<typeof Toast>

export default meta

type Story = Omit<StoryObj<typeof meta>, "args"> & {
  args: Omit<ToasterToast, "id">
}

type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
}

const ToastExample = (args: Story["args"]) => {
  const { toast } = useToast()
  return (
    <div>
      <button
        onClick={() => {
          toast(args)
        }}
      >
        Show Toast
      </button>
      <Toaster />
    </div>
  )
}

/**
 * The default form of the toast.
 */
export const Default: Story = {
  args: {
    description: "Your message has been sent.",
  },
}

/**
 * Use the `title` prop to provide a title for the toast.
 */
export const WithTitle: Story = {
  args: {
    title: "Uh oh! Something went wrong.",
    description: "There was a problem with your request.",
  },
}

/**
 * Use the `action` prop to provide an action for the toast.
 */
export const WithAction: Story = {
  args: {
    title: "Uh oh! Something went wrong.",
    description: "There was a problem with your request.",
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
}

/**
 * Use the `destructive` variant to indicate a destructive action.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
    title: "Uh oh! Something went wrong.",
    description: "There was a problem with your request.",
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
}
