import type { Meta, StoryObj } from "@storybook/react"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/default/ui/input-otp"

/**
 * Accessible one-time password component with copy paste functionality.
 */
const meta = {
  title: "ui/InputOTP",
  component: InputOTP,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    maxLength: 6,
    pattern: REGEXP_ONLY_DIGITS_AND_CHARS,
    render: ({ slots }) => (
      <InputOTPGroup>
        {slots.map((slot, index) => (
          <InputOTPSlot key={index} {...slot} />
        ))}
      </InputOTPGroup>
    ),
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof InputOTP>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the InputOTP field.
 */
export const Default: Story = {}

/**
 * Use multiple groups to separate the input slots.
 */
export const SeparatedGroup: Story = {
  render: (args) => (
    <InputOTP
      {...args}
      render={({ slots }) => (
        <>
          <InputOTPGroup>
            {slots.slice(0, args.maxLength / 2).map((slot, index) => (
              <InputOTPSlot key={index} {...slot} />
            ))}
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            {slots.slice(args.maxLength / 2).map((slot, index) => (
              <InputOTPSlot key={index + 3} {...slot} />
            ))}
          </InputOTPGroup>
        </>
      )}
    />
  ),
}
