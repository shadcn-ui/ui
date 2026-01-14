import { Tabs, TabsList, TabsTrigger } from "@/examples/base/ui/tabs"

export function TabsBasic() {
  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
