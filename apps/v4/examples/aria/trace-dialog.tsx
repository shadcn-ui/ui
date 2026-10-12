"use client"

import { ChevronRightIcon, GlobeIcon } from "lucide-react"
import { Button as ButtonPrimitive } from "react-aria-components"

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/styles/aria-rhea/ui/dialog"
import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/aria-rhea/ui/trace"

export function TraceDialog() {
  return (
    <Trace className="max-w-sm">
      <DialogTrigger>
        <ButtonPrimitive>
          <TraceLine>
            <TraceIcon>
              <GlobeIcon />
            </TraceIcon>
            <TraceTitle>Searched the web for cache keys</TraceTitle>
            <TraceIcon>
              <ChevronRightIcon />
            </TraceIcon>
          </TraceLine>
        </ButtonPrimitive>
        <Dialog>
          <DialogHeader>
            <DialogTitle>Searched the web for cache keys</DialogTitle>
            <DialogDescription>
              Three results were used in the response.
            </DialogDescription>
          </DialogHeader>
          <ul className="flex flex-col gap-2 text-sm">
            <li>Caching build outputs</li>
            <li>Image optimization reference</li>
            <li>Deploy hooks and cache keys</li>
          </ul>
        </Dialog>
      </DialogTrigger>
    </Trace>
  )
}
