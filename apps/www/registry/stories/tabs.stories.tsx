import type { Meta, StoryObj } from "@storybook/react"

import { Button } from "@/registry/default/ui/button"
import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/default/ui/tabs"

/**
 * A set of layered sections of content—known as tab panels—that are displayed
 * one at a time.
 */
const meta = {
  title: "ui/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    defaultValue: "account",
    className: "w-96",
    children: (
      <>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </>
    ),
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the tabs.
 */
export const Default: Story = {}
