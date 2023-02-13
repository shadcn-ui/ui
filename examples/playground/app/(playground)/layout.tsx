import Link from "next/link"
import { HelpCircle, Zap } from "lucide-react"

import { workspaces } from "@/data/teams"
import { user } from "@/data/user"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { Button, buttonVariants } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-b-slate-200 bg-white dark:border-b-slate-700 dark:bg-slate-900">
        <div className="container flex h-14 items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Icons.logo />
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
            <MainNav />
          </div>
          <nav className="ml-auto flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              className={cn(buttonVariants({ variant: "ghost" }), "h-9 px-2")}
            >
              <Icons.gitHub className="mr-2 h-4 w-4" /> GitHub
            </Link>
            <Button variant="ghost" className="h-9 pl-2">
              <HelpCircle className="mr-2 h-4 w-4" /> Help
            </Button>
            <UserNav user={user} teams={workspaces} />
          </nav>
        </div>
      </header>
      <main className="grid flex-1">{children}</main>
    </div>
  )
}
