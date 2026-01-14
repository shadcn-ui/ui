import { Tabs, TabsList, TabsTrigger } from "@/examples/radix/ui/tabs"

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
