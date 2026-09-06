import { Tabs, TabsList, TabsTrigger } from "@/styles/aria-nova/ui/tabs"

export function TabsVertical() {
  return (
    <Tabs defaultSelectedKey="account" orientation="vertical">
      <TabsList>
        <TabsTrigger id="account">Account</TabsTrigger>
        <TabsTrigger id="password">Password</TabsTrigger>
        <TabsTrigger id="notifications">Notifications</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
