import type { Meta, StoryObj } from "@storybook/react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import { Button } from "@/registry/new-york-v4/ui/button"

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="space-y-4 rounded-lg border p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Account</h3>
            <p className="text-muted-foreground text-sm">
              Make changes to your account here. Click save when you&apos;re
              done.
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              defaultValue="Pedro Duarte"
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              defaultValue="@peduarte"
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <Button>Save changes</Button>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="space-y-4 rounded-lg border p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Password</h3>
            <p className="text-muted-foreground text-sm">
              Change your password here. After saving, you&apos;ll be logged
              out.
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="current" className="text-sm font-medium">
              Current password
            </label>
            <input
              id="current"
              type="password"
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="new" className="text-sm font-medium">
              New password
            </label>
            <input
              id="new"
              type="password"
              className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <Button>Save password</Button>
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const LineVariant: Story = {
  name: "Line Variant",
  render: () => (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="p-4 text-sm">Overview content goes here.</div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="p-4 text-sm">Analytics content goes here.</div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="p-4 text-sm">Reports content goes here.</div>
      </TabsContent>
    </Tabs>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <div className="rounded-lg border p-4 text-sm">
          General settings content.
        </div>
      </TabsContent>
      <TabsContent value="security">
        <div className="rounded-lg border p-4 text-sm">
          Security settings content.
        </div>
      </TabsContent>
      <TabsContent value="notifications">
        <div className="rounded-lg border p-4 text-sm">
          Notification preferences content.
        </div>
      </TabsContent>
    </Tabs>
  ),
}

export const DisabledTab: Story = {
  name: "Disabled Tab",
  render: () => (
    <Tabs defaultValue="active" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <div className="p-4 text-sm">Active tab content.</div>
      </TabsContent>
      <TabsContent value="other">
        <div className="p-4 text-sm">Other tab content.</div>
      </TabsContent>
    </Tabs>
  ),
}
