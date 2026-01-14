import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/examples/base/ui/tabs"

export function TabsVertical() {
  return (
    <Tabs defaultValue="account" orientation="vertical">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <div className="style-nova:p-4 style-vega:p-6 style-maia:p-6 style-mira:p-4 style-lyra:p-4 style-nova:rounded-lg style-vega:rounded-lg style-maia:rounded-xl style-mira:rounded-md style-lyra:rounded-none border">
        <TabsContent value="account">
          Manage your account preferences and profile information.
        </TabsContent>
        <TabsContent value="password">
          Update your password to keep your account secure. Use a strong
          password with a mix of letters, numbers, and symbols.
        </TabsContent>
        <TabsContent value="notifications">
          Configure how you receive notifications and alerts. Choose which types
          of notifications you want to receive and how you want to receive them.
        </TabsContent>
      </div>
    </Tabs>
  )
}
