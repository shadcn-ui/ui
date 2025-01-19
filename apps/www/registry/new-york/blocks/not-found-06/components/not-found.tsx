import { ChevronRight, Search } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"

export function NotFound() {
  return (
    <div className="text-center">
      <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-primary sm:text-7xl max-w-4xl">
        The page you're looking for can't be found.
      </h1>
      <div className="mt-14 flex flex-col items-center justify-center gap-y-4 max-w-md mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-2 top-4 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search example.com" className="pl-8 h-12" />
        </div>
        <Button variant="link" className="gap-x-0.5 text-base" asChild>
          <a href="#">
            Or see our site map
            <ChevronRight />
          </a>
        </Button>
      </div>
    </div>
  )
}
