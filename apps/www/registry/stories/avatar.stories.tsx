import type { Meta, StoryObj } from "@storybook/react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/default/ui/avatar"

/**
 * An image element with a fallback for representing the user.
 */
const meta = {
  title: "ui/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    children: (
      <>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </>
    ),
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the avatar.
 */
export const Default: Story = {}
