import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@leadbank/ui"

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Lead tabs built on @radix-ui/react-tabs. Compose Tabs + TabsList + TabsTrigger + TabsContent. Sizes propagate from Tabs root via context (overridable per-trigger). Supports horizontal (default) and vertical orientation.",
      },
    },
    layout: "padded",
  },
}

export default meta

type Story = StoryObj<typeof Tabs>

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="overview" style={{ width: 480 }}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="changelog">Changelog</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p>High-level summary of this surface.</p>
      </TabsContent>
      <TabsContent value="usage">
        <p>How to wire this surface into a feature.</p>
      </TabsContent>
      <TabsContent value="changelog">
        <p>Release notes for the last few versions.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--lead-space-4)",
        width: 480,
      }}
    >
      <Tabs defaultValue="a" size="sm">
        <TabsList>
          <TabsTrigger value="a">Small A</TabsTrigger>
          <TabsTrigger value="b">Small B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">sm body</TabsContent>
      </Tabs>
      <Tabs defaultValue="a" size="md">
        <TabsList>
          <TabsTrigger value="a">Medium A</TabsTrigger>
          <TabsTrigger value="b">Medium B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">md body</TabsContent>
      </Tabs>
      <Tabs defaultValue="a" size="lg">
        <TabsList>
          <TabsTrigger value="a">Large A</TabsTrigger>
          <TabsTrigger value="b">Large B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">lg body</TabsContent>
      </Tabs>
    </div>
  ),
}

export const VerticalOrientation: Story = {
  name: "Vertical orientation",
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" style={{ width: 480 }}>
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <p>Workspace name, time zone, language.</p>
      </TabsContent>
      <TabsContent value="appearance">
        <p>Theme, density, accent.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p>Email cadence, mention rules.</p>
      </TabsContent>
      <TabsContent value="advanced">
        <p>API tokens, webhooks, exports.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const DisabledTab: Story = {
  name: "Disabled tab",
  render: () => (
    <Tabs defaultValue="a" style={{ width: 480 }}>
      <TabsList>
        <TabsTrigger value="a">Active</TabsTrigger>
        <TabsTrigger value="b" disabled>
          Disabled (admin only)
        </TabsTrigger>
        <TabsTrigger value="c">Sign out</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Active tab body.</TabsContent>
      <TabsContent value="b">Won't be shown.</TabsContent>
      <TabsContent value="c">Sign-out body.</TabsContent>
    </Tabs>
  ),
}

export const SettingsCard: Story = {
  name: "Settings card",
  render: () => (
    <Card style={{ width: 520 }}>
      <CardHeader>
        <CardTitle level={2}>Workspace settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications" orientation="vertical">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <p>Workspace metadata.</p>
          </TabsContent>
          <TabsContent value="notifications">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--lead-space-3)",
              }}
            >
              <Field>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <FieldLabel>Email digest</FieldLabel>
                  <FieldControl>
                    <Switch defaultChecked />
                  </FieldControl>
                </div>
                <FieldDescription>
                  A weekly summary of activity.
                </FieldDescription>
              </Field>
              <Field>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <FieldLabel>Mentions</FieldLabel>
                  <FieldControl>
                    <Switch defaultChecked />
                  </FieldControl>
                </div>
                <FieldDescription>
                  Alert me when someone @mentions me.
                </FieldDescription>
              </Field>
            </div>
          </TabsContent>
          <TabsContent value="security">
            <p>Two-factor, sessions, audit log.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  ),
}
