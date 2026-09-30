import { Tabs, TabsList, TabsTrigger } from "@/styles/aria-nova/ui/tabs"

export function TabsLine() {
  return (
    <Tabs defaultSelectedKey="overview">
      <TabsList variant="line">
        <TabsTrigger id="overview">Overview</TabsTrigger>
        <TabsTrigger id="analytics">Analytics</TabsTrigger>
        <TabsTrigger id="reports">Reports</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
