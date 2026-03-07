import { CircleAlertIcon } from "lucide-react"

import { Atom } from "@/components/lo-fi/atom"

export function AlertLoFi() {
  return (
    <Atom
      shade="100"
      className="rounder-lg flex items-start justify-between gap-2 border p-2"
    >
      <CircleAlertIcon className="size-3" />
      <div className="flex flex-1 flex-col gap-1">
        <Atom shade="300" className="h-2 w-2/3" />
        <Atom shade="200" className="h-2 w-full" />
      </div>
    </Atom>
  )
}
