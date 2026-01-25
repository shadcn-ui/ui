import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"

function BaseUILogo() {
  return (
    <svg width="17" height="24" viewBox="0 0 17 24" className="size-3">
      <path
        fill="currentColor"
        d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z"
      />
      <path
        fill="currentColor"
        d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z"
      />
    </svg>
  )
}

export function Announcement() {
  return (
    <Badge asChild variant="secondary" className="bg-transparent">
      <Link href="/docs/changelog">
        <BaseUILogo />
        Base UI Documentation <ArrowRightIcon />
      </Link>
    </Badge>
  )
}
