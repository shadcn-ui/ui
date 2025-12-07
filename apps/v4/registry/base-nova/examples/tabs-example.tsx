import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/base/ui/tabs"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function TabsExample() {
  return (
    <ExampleWrapper>
      <TabsBasic />
      <TabsLine />
      <TabsVariantsComparison />
      <TabsDisabled />
      <TabsWithIcons />
      <TabsIconOnly />
      <TabsMultiple />
      <TabsWithContent />
      <TabsLineWithContent />
      <TabsLineDisabled />
      <TabsWithDropdown />
      <TabsVertical />
      <TabsNestedLineInDefault />
      <TabsNestedDefaultInLine />
    </ExampleWrapper>
  )
}

function TabsBasic() {
  return (
    <Example title="Basic">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  )
}

function TabsLine() {
  return (
    <Example title="Line">
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  )
}

function TabsVariantsComparison() {
  return (
    <Example title="Variants Alignment">
      <div className="flex gap-4">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </Example>
  )
}

function TabsDisabled() {
  return (
    <Example title="Disabled">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="settings" disabled>
            Disabled
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  )
}

function TabsWithIcons() {
  return (
    <Example title="With Icons">
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
    </Example>
  )
}

function TabsIconOnly() {
  return (
    <Example title="Icon Only">
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
    </Example>
  )
}

function TabsMultiple() {
  return (
    <Example title="Multiple">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  )
}

function TabsWithContent() {
  return (
    <Example title="With Content">
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
    </Example>
  )
}

function TabsLineWithContent() {
  return (
    <Example title="Line With Content">
      <Tabs defaultValue="account">
        <TabsList variant="line">
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
    </Example>
  )
}

function TabsLineDisabled() {
  return (
    <Example title="Line Disabled">
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  )
}

function TabsWithDropdown() {
  return (
    <Example title="With Dropdown">
      <Tabs defaultValue="overview">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" className="size-8" />}
            >
              <IconPlaceholder
                lucide="MoreHorizontalIcon"
                tabler="IconDots"
                hugeicons="MoreHorizontalIcon"
              />
              <span className="sr-only">More options</span>
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
    </Example>
  )
}

function TabsVertical() {
  return (
    <Example title="Vertical">
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
    </Example>
  )
}

function TabsNestedLineInDefault() {
  return (
    <Example title="Nested Line in Default">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="rounded-lg border p-4">
            <Tabs defaultValue="dashboard">
              <TabsList variant="line">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <p className="text-muted-foreground text-sm">
                  Dashboard content goes here.
                </p>
              </TabsContent>
              <TabsContent value="reports">
                <p className="text-muted-foreground text-sm">
                  Reports content goes here.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Analytics</h3>
            <p className="text-muted-foreground text-sm">
              View your analytics data here.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Settings</h3>
            <p className="text-muted-foreground text-sm">
              Configure your settings here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Example>
  )
}

function TabsNestedDefaultInLine() {
  return (
    <Example title="Nested Default in Line">
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="rounded-lg border p-4">
            <Tabs defaultValue="dashboard">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <p className="text-muted-foreground text-sm">
                  Dashboard content goes here.
                </p>
              </TabsContent>
              <TabsContent value="reports">
                <p className="text-muted-foreground text-sm">
                  Reports content goes here.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Analytics</h3>
            <p className="text-muted-foreground text-sm">
              View your analytics data here.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-medium">Settings</h3>
            <p className="text-muted-foreground text-sm">
              Configure your settings here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Example>
  )
}
