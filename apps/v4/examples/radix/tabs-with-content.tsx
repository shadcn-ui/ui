import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/examples/radix/ui/tabs"

export function TabsWithContent() {
  return (
    <Tabs defaultValue="account">
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
          Update your password to keep your account secure.
        </TabsContent>
        <TabsContent value="notifications">
          Configure how you receive notifications and alerts.
        </TabsContent>
      </div>
    </Tabs>
  )
}
