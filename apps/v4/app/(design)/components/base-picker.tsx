"use client"

import * as React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"

import { BASES, type Base } from "@/registry/bases"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

export function BasePicker() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentBaseName =
    typeof params.base === "string" ? params.base : undefined

  const currentBase = React.useMemo(
    () => BASES.find((base) => base.name === currentBaseName),
    [currentBaseName]
  )

  const handleValueChange = React.useCallback(
    (value: string) => {
      const newBase = BASES.find((base) => base.name === value)
      if (!newBase) {
        return
      }

      // Preserve search params when navigating to a new base.
      const currentSearchParams = searchParams.toString()
      const url = `/design/${newBase.name}${
        currentSearchParams ? `?${currentSearchParams}` : ""
      }`
      router.push(url)
    },
    [router, searchParams]
  )

  return (
    <Select value={currentBase?.name} onValueChange={handleValueChange}>
      <SelectTrigger className="relative">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">
              Component Library
            </div>
            <div className="text-foreground text-sm font-medium">
              {currentBase?.title}
            </div>
          </div>
          {currentBase?.meta?.logo && (
            <div
              className="text-foreground *:[svg]:text-foreground! absolute top-1/2 right-4 size-4 -translate-y-1/2"
              dangerouslySetInnerHTML={{
                __html: currentBase.meta.logo,
              }}
            />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="left"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {BASES.map((base) => (
          <SelectItem key={base.name} value={base.name} className="rounded-lg">
            <div className="flex items-center gap-2">
              {base.meta?.logo && (
                <div
                  className="text-foreground *:[svg]:text-foreground! size-4 shrink-0 [&_svg]:size-4"
                  dangerouslySetInnerHTML={{
                    __html: base.meta.logo,
                  }}
                />
              )}
              {base.title}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
