import { Search } from "lucide-react"

import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"

export function NotFound() {
  return (
    <div className="relative text-center z-[1] pt-52">
      <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-primary sm:text-7xl">
        Page not found
      </h1>
      <p className="mt-6 text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8">
        Lost, this page is. In another system, it may be.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-y-3 sm:space-x-2 mx-auto sm:max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-8" />
        </div>
        <Button variant="outline">Search</Button>
      </div>
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-y-3 gap-x-6">
        <Button variant="secondary" asChild>
          <a href="#">
            <span aria-hidden="true">&larr;</span> Go back
          </a>
        </Button>
        <Button className="-order-1 sm:order-none" asChild>
          <a href="#">Take me home</a>
        </Button>
      </div>
    </div>
  )
}
