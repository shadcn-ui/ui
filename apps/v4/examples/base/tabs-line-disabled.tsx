import { Tabs, TabsList, TabsTrigger } from "@/examples/base/ui/tabs"

export function TabsLineDisabled() {
  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports" disabled>
          Reports
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
