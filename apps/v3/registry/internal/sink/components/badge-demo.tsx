import { AlertCircleIcon, ArrowRightIcon, CheckIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"

export function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full flex-col gap-2 md:flex-row">
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="outline">
          <CheckIcon />
          Badge
        </Badge>
        <Badge variant="destructive">
          <AlertCircleIcon />
          Alert
        </Badge>
        <Badge className="size-5 rounded-full p-0 font-mono tabular-nums">
          8
        </Badge>
      </div>
      <div className="flex w-full flex-col gap-2 md:flex-row">
        <Badge asChild>
          <a href="#">
            Link <ArrowRightIcon />
          </a>
        </Badge>
        <Badge asChild variant="secondary">
          <a href="#">
            Link <ArrowRightIcon />
          </a>
        </Badge>
        <Badge asChild variant="destructive">
          <a href="#">
            Link <ArrowRightIcon />
          </a>
        </Badge>
        <Badge asChild variant="outline">
          <a href="#">
            Link <ArrowRightIcon />
          </a>
        </Badge>
      </div>
    </div>
  )
}
