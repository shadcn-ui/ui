import { Button } from "@/registry/bases/radix/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/radix/ui/dropdown-menu"
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
        <TabsLine />
        <TabsVariantsComparison />
        <TabsMultiple />
        <TabsWithContent />
        <TabsLineWithContent />
        <TabsLineDisabled />
        <TabsWithDropdown />
        <TabsDisabled />
        <TabsWithIcons />
        <TabsIconOnly />
        <TabsVertical />
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

function TabsLine() {
  return (
    <Frame title="Line">
      <Tabs defaultValue="overview" variant="line">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
      </Tabs>
    </Frame>
  )
}

function TabsVariantsComparison() {
  return (
    <Frame title="Variants Alignment">
      <div className="flex gap-4">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="overview" variant="line">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
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

function TabsIconOnly() {
  return (
    <Frame title="Icon Only">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">
            <IconPlaceholder
              lucide="HomeIcon"
              tabler="IconHome"
              hugeicons="HomeIcon"
            />
          </TabsTrigger>
          <TabsTrigger value="search">
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="SearchIcon"
            />
          </TabsTrigger>
          <TabsTrigger value="settings">
            <IconPlaceholder
              lucide="SettingsIcon"
              tabler="IconSettings"
              hugeicons="SettingsIcon"
            />
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

function TabsLineWithContent() {
  return (
    <Frame title="Line With Content">
      <Tabs defaultValue="account" variant="line">
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

function TabsLineDisabled() {
  return (
    <Frame title="Line Disabled">
      <Tabs defaultValue="overview" variant="line">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Frame>
  )
}

function TabsWithDropdown() {
  return (
    <Frame title="With Dropdown">
      <Tabs defaultValue="overview">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <IconPlaceholder
                  lucide="MoreHorizontalIcon"
                  tabler="IconDots"
                  hugeicons="MoreHorizontalIcon"
                />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TabsContent value="overview">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Overview</h3>
            <p className="text-muted-foreground text-sm">
              View your dashboard metrics and key performance indicators.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Analytics</h3>
            <p className="text-muted-foreground text-sm">
              Detailed analytics and insights about your data.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Reports</h3>
            <p className="text-muted-foreground text-sm">
              Generate and view custom reports.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Frame>
  )
}

function TabsVertical() {
  return (
    <Frame title="Vertical">
      <Tabs defaultValue="account" orientation="vertical">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="rounded-lg border p-6">
            <h3 className="mb-4 text-base font-semibold">Account Settings</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Manage your account preferences and profile information.
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Display Name
                </label>
                <p className="text-muted-foreground text-sm">
                  Your display name appears on your profile and in comments.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div className="rounded-lg border p-6">
            <h3 className="mb-4 text-base font-semibold">Password Settings</h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Update your password to keep your account secure. Use a strong
              password with a mix of letters, numbers, and symbols.
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="mb-2 text-sm font-medium">
                  Password Requirements
                </h4>
                <ul className="text-muted-foreground ml-4 list-disc space-y-1 text-sm">
                  <li>At least 8 characters long</li>
                  <li>Contains uppercase and lowercase letters</li>
                  <li>Includes at least one number</li>
                  <li>Contains at least one special character</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="rounded-lg border p-6">
            <h3 className="mb-4 text-base font-semibold">
              Notification Settings
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Configure how you receive notifications and alerts. Choose which
              types of notifications you want to receive and how you want to
              receive them.
            </p>
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="mb-3 text-sm font-medium">
                  Email Notifications
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New comments</span>
                    <span className="text-muted-foreground text-xs">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly digest</span>
                    <span className="text-muted-foreground text-xs">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Security alerts</span>
                    <span className="text-muted-foreground text-xs">
                      Enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Frame>
  )
}
