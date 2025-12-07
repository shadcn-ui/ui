"use client"

import { useTheme } from "next-themes"
import { useQueryStates } from "nuqs"

import { type MenuColorValue } from "@/registry/config"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

const MENU_OPTIONS = [
  {
    value: "default" as const,
    label: "Default",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="128"
        height="128"
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        stroke="currentColor"
        className="text-foreground"
      >
        <path
          d="M2 11.5C2 7.02166 2 4.78249 3.39124 3.39124C4.78249 2 7.02166 2 11.5 2C15.9783 2 18.2175 2 19.6088 3.39124C21 4.78249 21 7.02166 21 11.5C21 15.9783 21 18.2175 19.6088 19.6088C18.2175 21 15.9783 21 11.5 21C7.02166 21 4.78249 21 3.39124 19.6088C2 18.2175 2 15.9783 2 11.5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8.5 11.5L14.5001 11.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 15H13.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 8H15.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    value: "inverted" as const,
    label: "Inverted",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="128"
        height="128"
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        className="fill-foreground text-foreground"
      >
        <path
          d="M2 11.5C2 7.02166 2 4.78249 3.39124 3.39124C4.78249 2 7.02166 2 11.5 2C15.9783 2 18.2175 2 19.6088 3.39124C21 4.78249 21 7.02166 21 11.5C21 15.9783 21 18.2175 19.6088 19.6088C18.2175 21 15.9783 21 11.5 21C7.02166 21 4.78249 21 3.39124 19.6088C2 18.2175 2 15.9783 2 11.5Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M8.5 11.5L14.5001 11.5"
          stroke="var(--background)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 15H13.5"
          stroke="var(--background)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 8H15.5"
          stroke="var(--background)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const

export function MenuColorPicker() {
  const { resolvedTheme } = useTheme()
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })
  const currentMenu = MENU_OPTIONS.find(
    (menu) => menu.value === params.menuColor
  )

  return (
    <Select
      value={currentMenu?.value}
      onValueChange={(value) => {
        setParams({ menuColor: value as MenuColorValue })
      }}
    >
      <SelectTrigger className="relative" disabled={resolvedTheme === "dark"}>
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">Menu Color</div>
            <div className="text-foreground text-sm font-medium">
              {currentMenu?.label}
            </div>
          </div>
          <div className="text-foreground absolute top-1/2 right-4 ml-auto flex size-4 -translate-y-1/2 items-center justify-center text-base">
            {currentMenu?.icon}
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
            {menu.icon}
            {menu.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
