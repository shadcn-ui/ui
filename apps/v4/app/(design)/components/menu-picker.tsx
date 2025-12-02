"use client"

import { useQueryStates } from "nuqs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

const MENU_OPTIONS = [
  { value: "default" as const, label: "Default" },
  { value: "inverted" as const, label: "Inverted" },
] as const

export function MenuPicker() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentMenu = MENU_OPTIONS.find((menu) => menu.value === params.menu)

  return (
    <Select
      value={currentMenu?.value}
      onValueChange={(value) => {
        setParams({ menu: value as "default" | "inverted" })
      }}
    >
      <SelectTrigger>
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">Menu</div>
            <div className="text-foreground text-sm font-medium">
              {currentMenu?.label}
            </div>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="left"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {MENU_OPTIONS.map((menu) => (
          <SelectItem
            key={menu.value}
            value={menu.value}
            className="rounded-lg"
          >
            {menu.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
