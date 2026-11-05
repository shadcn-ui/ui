"use client"

import { ChevronRightIcon, FolderSearchIcon } from "lucide-react"
import { Button as ButtonPrimitive } from "react-aria-components"

import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/styles/aria-rhea/ui/sheet"
import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/aria-rhea/ui/trace"

export function TraceSheet() {
  return (
    <Trace className="max-w-sm">
      <SheetTrigger>
        <ButtonPrimitive>
          <TraceLine>
            <TraceIcon>
              <FolderSearchIcon />
            </TraceIcon>
            <TraceTitle>Explored 4 files</TraceTitle>
            <TraceIcon>
              <ChevronRightIcon />
            </TraceIcon>
          </TraceLine>
        </ButtonPrimitive>
        <Sheet>
          <SheetHeader>
            <SheetTitle>Explored 4 files</SheetTitle>
            <SheetDescription>
              Files read while preparing the response.
            </SheetDescription>
          </SheetHeader>
          <ul className="flex flex-col gap-2 px-6 font-mono text-xs">
            <li>apps/v4/lib/docs.ts</li>
            <li>apps/v4/lib/components.ts</li>
            <li>apps/v4/next.config.mjs</li>
            <li>apps/v4/package.json</li>
          </ul>
        </Sheet>
      </SheetTrigger>
    </Trace>
  )
}
