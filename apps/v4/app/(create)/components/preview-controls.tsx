"use client"

import { Monitor, Smartphone, Tablet } from "lucide-react"
import { useQueryStates } from "nuqs"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york-v4/ui/toggle-group"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function PreviewControls() {
  const [urlParams, setUrlParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  return (
    <div className="flex h-8 items-center gap-1.5 rounded-md border p-1">
      <ToggleGroup
        type="single"
        value={(urlParams.size ?? 100).toString()}
        onValueChange={(newValue) => {
          if (newValue) {
            setUrlParams({ size: parseInt(newValue) })
          }
        }}
        className="gap-1 *:data-[slot=toggle-group-item]:!size-6 *:data-[slot=toggle-group-item]:!rounded-sm"
      >
        <ToggleGroupItem value="100" title="Desktop">
          <Monitor />
        </ToggleGroupItem>
        <ToggleGroupItem value="60" title="Tablet">
          <Tablet />
        </ToggleGroupItem>
        <ToggleGroupItem value="30" title="Mobile">
          <Smartphone />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
