"use client"

import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"

export function PackageManager({
  defaultPackageManager,
}: {
  defaultPackageManager: string
}) {
  const [state, setState] = useState(defaultPackageManager)

  return (
    <Select
      value={state}
      onValueChange={(value) => {
        setState(value)
        document.cookie = `package-manager=${value}; expires=${new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toUTCString()}`
      }}
    >
      <SelectTrigger className="w-[80px] border-none shadow-none">
        <SelectValue placeholder="Pick you package manager" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__npmCommand__">npm</SelectItem>
        <SelectItem value="__pnpmCommand__">pnpm</SelectItem>
        <SelectItem value="__yarnCommand__">yarn</SelectItem>
        <SelectItem value="__bunCommand__">bun</SelectItem>
      </SelectContent>
    </Select>
  )
}
