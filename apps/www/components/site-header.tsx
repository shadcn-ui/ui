import Link from "next/link"

import { siteConfig } from "@/config/site"
import { CurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { CommandMenu } from "@/components/command-menu"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { buttonVariants } from "@/registry/new-york/ui/button"

import LogoutButton from "./auth/logout-button"
import BuyButton from "./buy-button"

type SiteHeaderProps = {
  user: CurrentUser & { isPro: boolean }
}
export function SiteHeader({ user }: SiteHeaderProps) {
  return (
    <header className="supports-backdrop-blur:bg-background/50 sticky top-0 z-40 w-full border-b bg-background/50 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        {user.isPro ? null : (
          <div className="flex flex-1 justify-center">
            <BuyButton user={user}>Buy the kit 🪄✨</BuyButton>
          </div>
        )}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center">
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.twitter className="h-4 w-4 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ModeToggle />
          </nav>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
