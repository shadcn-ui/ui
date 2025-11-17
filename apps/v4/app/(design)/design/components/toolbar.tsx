import Link from "next/link"
import { RegistryItem } from "shadcn/schema"

import { siteConfig } from "@/lib/config"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
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
    <div className="z-10 flex h-14 shrink-0 items-center gap-4 px-6 **:data-[slot=separator]:!h-4">
      <div className="flex items-center">
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
        <MainNav items={siteConfig.navItems} />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <PreviewControls />
        <Separator orientation="vertical" />
        <ItemPicker items={items} />
        <Separator orientation="vertical" />
        <ModeSwitcher />
        <Separator orientation="vertical" className="ml-2 hidden lg:block" />
        <InstallDialog />
      </div>
    </div>
  )
}
