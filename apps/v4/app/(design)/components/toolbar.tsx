import Link from "next/link"
import { RegistryItem } from "shadcn/schema"

import { siteConfig } from "@/lib/config"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { SiteConfig } from "@/components/site-config"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { InstallDialog } from "@/app/(design)/components/install-dialog"
import { PreviewControls } from "@/app/(design)/components/preview-controls"

export function Toolbar({
  items,
}: {
  items: Pick<RegistryItem, "name" | "title" | "type">[]
}) {
  return (
    <header className="bg-background w-full">
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:!h-4">
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
            <PreviewControls />
            <Separator orientation="vertical" />
            <ModeSwitcher />
            <Separator orientation="vertical" className="3xl:flex hidden" />
            <SiteConfig className="3xl:flex hidden" />
            <Separator orientation="vertical" />
            <InstallDialog />
          </div>
        </div>
      </div>
    </header>
  )
}
