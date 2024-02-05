import type { Meta, StoryObj } from "@storybook/react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/default/ui/hover-card"

/**
 * For sighted users to preview content available behind a link.
 */
const meta = {
  title: "ui/HoverCard",
  component: HoverCard,
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
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent>
          The React Framework - created and maintained by @vercel.
        </HoverCardContent>
      </>
    ),
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof HoverCard>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the hover card.
 */
export const Default: Story = {}

/**
 * Use the `openDelay` and `closeDelay` props to control the delay before the
 * hover card opens and closes.
 */
export const Instant: Story = {
  args: {
    openDelay: 0,
    closeDelay: 0,
  },
}
