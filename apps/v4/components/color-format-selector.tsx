"use client"

import * as React from "react"

import { getColorFormat, type Color } from "@/lib/colors"
import { cn } from "@/lib/utils"
import { useColors } from "@/hooks/use-colors"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/new-york-v4/ui/select"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"

export function ColorFormatSelector({
  color,
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectTrigger>, "color"> & {
  color: Color
}) {
  const { format, setFormat, isLoading } = useColors()
  const formats = React.useMemo(() => getColorFormat(color), [color])

  if (isLoading) {
    return <ColorFormatSelectorSkeleton />
  }

  return (
    <Select value={format} onValueChange={setFormat}>
      <SelectTrigger
        size="sm"
        className={cn(
          "bg-secondary text-secondary-foreground border-secondary shadow-none",
          className
        )}
        {...props}
      >
        <span className="font-medium">Format: </span>
        <span className="text-muted-foreground font-mono">{format}</span>
      </SelectTrigger>
      <SelectContent align="end" className="rounded-xl">
        {Object.entries(formats).map(([format, value]) => (
          <SelectItem
            key={format}
            value={format}
            className="gap-2 rounded-lg [&>span]:flex [&>span]:items-center [&>span]:gap-2"
          >
            <span className="font-medium">{format}</span>
            <span className="text-muted-foreground font-mono text-xs">
              {value}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ColorFormatSelectorSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton
      className={cn("h-8 w-[132px] gap-1.5 rounded-md", className)}
      {...props}
    />
  )
}
