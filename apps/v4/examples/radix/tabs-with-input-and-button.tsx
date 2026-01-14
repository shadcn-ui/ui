import { Button } from "@/examples/radix/ui/button"
import { Input } from "@/examples/radix/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/examples/radix/ui/tabs"

export function TabsWithInputAndButton() {
  return (
    <Tabs defaultValue="overview" className="mx-auto w-full max-w-lg">
      <div className="flex items-center gap-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Input placeholder="Search..." className="w-44" />
          <Button>Action</Button>
        </div>
      </div>
      <div className="style-nova:p-4 style-vega:p-6 style-maia:p-6 style-mira:p-4 style-lyra:p-4 style-nova:rounded-lg style-vega:rounded-lg style-maia:rounded-xl style-mira:rounded-md style-lyra:rounded-none border">
        <TabsContent value="overview">
          View your dashboard metrics and key performance indicators.
        </TabsContent>
        <TabsContent value="analytics">
          Detailed analytics and insights about your data.
        </TabsContent>
        <TabsContent value="reports">
          Generate and view custom reports.
        </TabsContent>
      </div>
    </Tabs>
  )
}
