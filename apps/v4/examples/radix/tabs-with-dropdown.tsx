import { Button } from "@/examples/radix/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/examples/radix/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/examples/radix/ui/tabs"
import { MoreHorizontalIcon } from "lucide-react"

export function TabsWithDropdown() {
  return (
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
              <MoreHorizontalIcon />
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
