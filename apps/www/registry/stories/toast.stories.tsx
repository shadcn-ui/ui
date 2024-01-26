import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@/registry/default/ui/button"
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
const meta: Meta<typeof Toast> = {
  title: "ui/Toast",
  component: Toast,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "centered",
  },
}
export default meta

type Story = Omit<StoryObj<typeof Toast>, "args"> & {
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
      <Button
        variant="outline"
        onClick={() => {
          toast(args)
        }}
      >
        Show Toast
      </Button>
      <Toaster />
    </div>
  )
}

export const Simple: Story = {
  render: (args) => <ToastExample {...args} />,
  args: {
    description: "Your message has been sent.",
  },
}

export const WithTitle: Story = {
  render: Simple.render,
  args: {
    title: "Uh oh! Something went wrong.",
    description: "There was a problem with your request.",
  },
}

export const WithAction: Story = {
  render: Simple.render,
  args: {
    title: "Uh oh! Something went wrong.",
    description: "There was a problem with your request.",
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
}

export const Destructive: Story = {
  render: Simple.render,
  args: {
    variant: "destructive",
    title: "Uh oh! Something went wrong.",
    description: "There was a problem with your request.",
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
}
