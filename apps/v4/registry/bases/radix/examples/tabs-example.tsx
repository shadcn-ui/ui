import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/radix/ui/tabs"
import Frame from "@/app/(design)/design/components/frame"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function TabsExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <TabsBasic />
        <TabsDisabled />
        <TabsWithIcons />
        <TabsMultiple />
        <TabsWithContent />
      </div>
    </div>
  )
}

function TabsBasic() {
  return (
    <Frame title="Basic">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    </Frame>
  )
}

function TabsDisabled() {
  return (
    <Frame title="Disabled">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="settings" disabled>
            Disabled
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Frame>
  )
}

function TabsWithIcons() {
  return (
    <Frame title="With Icons">
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">
            <IconPlaceholder
              lucide="AppWindowIcon"
              tabler="IconAppWindow"
              hugeicons="CursorInWindowIcon"
            />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            <IconPlaceholder
              lucide="CodeIcon"
              tabler="IconCode"
              hugeicons="CodeIcon"
            />
            Code
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Frame>
  )
}

function TabsMultiple() {
  return (
    <Frame title="Multiple">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    </Frame>
  )
}

function TabsWithContent() {
  return (
    <Frame title="With Content">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Account Settings</h3>
            <p className="text-muted-foreground text-sm">
              Manage your account preferences and profile information.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Password Settings</h3>
            <p className="text-muted-foreground text-sm">
              Update your password to keep your account secure.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Notification Settings</h3>
            <p className="text-muted-foreground text-sm">
              Configure how you receive notifications and alerts.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Frame>
  )
}
