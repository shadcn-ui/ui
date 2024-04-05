import { Search } from "lucide-react"

import { Input } from "@/registry/new-york/ui/input"

export default function Component() {
  return (
    <div
      className="relative ml-auto flex-1 md:grow-0"
      x-chunk="dashboard-05-chunk-0"
    >
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
      />
    </div>
  )
}
