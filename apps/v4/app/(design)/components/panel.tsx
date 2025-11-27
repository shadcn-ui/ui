import { RegistryItem } from "shadcn/schema"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import { Customizer } from "@/app/(design)/components/customizer"
import { ItemExplorer } from "@/app/(design)/components/item-explorer"

export function Panel({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title">[]
}) {
  return (
    <Tabs
      defaultValue="customizer"
      className="flex w-56 flex-col gap-2 overflow-hidden rounded-xl border p-2"
    >
      <TabsList className="w-full">
        <TabsTrigger value="customizer">Customizer</TabsTrigger>
        <TabsTrigger value="explorer">Explorer</TabsTrigger>
      </TabsList>
      <div className="flex flex-1 overflow-hidden">
        <TabsContent
          value="customizer"
          className="no-scrollbar flex flex-1 flex-col overflow-y-auto"
        >
          <Customizer />
        </TabsContent>
        <TabsContent
          value="explorer"
          className="no-scrollbar flex flex-1 flex-col overflow-y-auto rounded-lg border"
        >
          <ItemExplorer items={items} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
