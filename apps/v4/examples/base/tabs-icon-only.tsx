import { Tabs, TabsList, TabsTrigger } from "@/examples/base/ui/tabs"
import { HomeIcon, SearchIcon, SettingsIcon } from "lucide-react"

export function TabsIconOnly() {
  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">
          <HomeIcon />
        </TabsTrigger>
        <TabsTrigger value="search">
          <SearchIcon />
        </TabsTrigger>
        <TabsTrigger value="settings">
          <SettingsIcon />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
