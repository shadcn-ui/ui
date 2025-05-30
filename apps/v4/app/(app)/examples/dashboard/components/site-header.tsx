import { IconCirclePlusFilled } from "@tabler/icons-react"

import { Button } from "@/registry/new-york-v4/ui/button"

export function SiteHeader() {
  return (
    <header className="bg-background/90 sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="hidden h-7 sm:flex">
            <IconCirclePlusFilled />
            <span>Quick Create</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
