import { RegistryItem } from "shadcn/schema"

import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"
import { ItemPicker } from "@/app/(app)/design/components/item-picker"

export function Toolbar({ items }: { items: RegistryItem[] }) {
  return (
    <div className="fixed top-20 right-6 z-10 flex gap-4">
      <ItemPicker items={items} />
      <Button size="sm">
        <Icons.logo />
        Install
      </Button>
    </div>
  )
}
