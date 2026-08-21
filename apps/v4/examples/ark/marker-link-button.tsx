"use client"

import { GitBranchIcon, RotateCcwIcon } from "lucide-react"
import { toast } from "@/examples/ark/ui/toast"

import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/examples/ark/ui/marker"

export function MarkerLinkButtonDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Marker asChild>
        <a href="#links-and-buttons">
          <MarkerIcon>
            <GitBranchIcon />
          </MarkerIcon>
          <MarkerContent>View the pull request</MarkerContent>
        </a>
      </Marker>
      <Marker asChild>
        <button
          type="button"
          className="transition-colors hover:text-foreground"
          onClick={() => toast.create({ title: "You clicked the revert button" })}
        >
          <MarkerIcon>
            <RotateCcwIcon />
          </MarkerIcon>
          <MarkerContent>Revert this change</MarkerContent>
        </button>
      </Marker>
    </div>
  )
}
