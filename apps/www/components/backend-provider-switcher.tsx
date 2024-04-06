"use client"

import * as React from "react"
import { type SelectTriggerProps } from "@radix-ui/react-select"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { BackendProvider, backendProviders } from "@/registry/backend-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
import { Style, styles } from "@/registry/styles"

export function BackendProviderSwitcher({
  className,
  ...props
}: SelectTriggerProps) {
  const [config, setConfig] = useConfig()

  return (
    <Select
      value={config.backendProvider}
      onValueChange={(value: BackendProvider["name"]) =>
        setConfig({
          ...config,
          backendProvider: value,
        })
      }
    >
      <SelectTrigger
        className={cn(
          "h-7 w-[160px] text-xs [&_svg]:h-4 [&_svg]:w-4",
          className
        )}
        {...props}
      >
        <span className="text-muted-foreground">Provider: </span>
        <SelectValue placeholder="Select style" />
      </SelectTrigger>
      <SelectContent>
        {backendProviders.map((backendProvider) => (
          <SelectItem
            key={backendProvider.name}
            value={backendProvider.name}
            className="text-xs"
          >
            {backendProvider.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
