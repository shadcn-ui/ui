import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { RegistryItem } from "shadcn/schema"

import { ModeSwitcher } from "@/components/mode-switcher"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { InstallDialog } from "@/app/(design)/design/components/install-dialog"
import { ItemPicker } from "@/app/(design)/design/components/item-picker"
import { PreviewControls } from "@/app/(design)/design/components/preview-controls"

export function Toolbar({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title">[]
}) {
  return (
    <div className="z-10 flex h-14 shrink-0 items-center justify-between gap-4 px-6 **:data-[slot=separator]:!h-4">
      <div className="flex flex-1 items-center">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <IconArrowLeft data-slot="icon-align-start" />
            Back
          </Link>
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center gap-2">
        <ItemPicker items={items} />
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <PreviewControls />
        <Separator orientation="vertical" />
        <ModeSwitcher />
        <Separator orientation="vertical" />
        <InstallDialog />
      </div>
    </div>
  )
}
