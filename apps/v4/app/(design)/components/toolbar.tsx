import Link from "next/link"
import { RegistryItem } from "shadcn/schema"

import { siteConfig } from "@/lib/config"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { InstallDialog } from "@/app/(design)/components/install-dialog"
import { ItemNav } from "@/app/(design)/components/item-nav"
import { ItemPicker } from "@/app/(design)/components/item-picker"
import { PreviewControls } from "@/app/(design)/components/preview-controls"

export function Toolbar({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title" | "type">[]
}) {
  return (
    <div className="z-10 flex h-14 shrink-0 items-center justify-between gap-4 px-6 **:data-[slot=separator]:!h-4">
      <div className="flex flex-1 items-center">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="hidden size-8 lg:flex"
        >
          <Link href="/">
            <Icons.logo className="size-5" />
            <span className="sr-only">{siteConfig.name}</span>
          </Link>
        </Button>
        <MainNav items={siteConfig.navItems} className="hidden lg:flex" />
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <ItemPicker items={items} />
        <ItemNav items={items} />
        <Separator orientation="vertical" />
        <PreviewControls />
        <Separator orientation="vertical" />
        <ModeSwitcher />
        <Separator orientation="vertical" />
        <InstallDialog />
      </div>
    </div>
  )
}
