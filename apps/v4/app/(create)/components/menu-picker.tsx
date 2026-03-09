"use client"

import * as React from "react"

import { useTheme } from "next-themes"

import { type MenuColorValue } from "@/registry/config"
import { useMounted } from "@/hooks/use-mounted"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerLabel,
  PickerRadioGroup,
  PickerRadioItem,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

const MENU_ICON_PATH =
  "M2 11.5C2 7.02166 2 4.78249 3.39124 3.39124C4.78249 2 7.02166 2 11.5 2C15.9783 2 18.2175 2 19.6088 3.39124C21 4.78249 21 7.02166 21 11.5C21 15.9783 21 18.2175 19.6088 19.6088C18.2175 21 15.9783 21 11.5 21C7.02166 21 4.78249 21 3.39124 19.6088C2 18.2175 2 15.9783 2 11.5Z"

const MENU_GROUPS = [
  {
    label: "Default",
    items: [
      {
        value: "default" as const,
        label: "Solid",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            viewBox="0 0 24 24"
            fill="none"
            role="img"
            stroke="currentColor"
            className="size-4 text-foreground"
          >
            <path d={MENU_ICON_PATH} strokeWidth="2" />
            <path d="M8.5 11.5L14.5001 11.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 15H13.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 8H15.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        value: "translucent" as const,
        label: "Translucent",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            viewBox="0 0 24 24"
            fill="none"
            role="img"
            className="size-4"
          >
            <path d={MENU_ICON_PATH} stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <path d="M8.5 11.5L14.5001 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 15H13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 8H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Inverted",
    inverted: true,
    items: [
      {
        value: "inverted" as const,
        label: "Solid",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            viewBox="0 0 24 24"
            fill="none"
            role="img"
            className="size-4 fill-foreground"
          >
            <path d={MENU_ICON_PATH} stroke="currentColor" strokeWidth="2" />
            <path d="M8.5 11.5L14.5001 11.5" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 15H13.5" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 8H15.5" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        value: "translucent-inverted" as const,
        label: "Translucent",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="128"
            height="128"
            viewBox="0 0 24 24"
            fill="none"
            role="img"
            className="size-4"
          >
            <path d={MENU_ICON_PATH} stroke="currentColor" strokeWidth="2" opacity="0.5" fill="currentColor" />
            <path d="M8.5 11.5L14.5001 11.5" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 15H13.5" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 8H15.5" stroke="var(--background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
    ],
  },
]

const ALL_OPTIONS = MENU_GROUPS.flatMap((group) => group.items)

export function MenuColorPicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useDesignSystemSearchParams()
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
  const isDark = mounted && resolvedTheme === "dark"
  const currentMenu = ALL_OPTIONS.find(
    (menu) => menu.value === params.menuColor
  )

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-xs text-muted-foreground">Menu Color</div>
            <div className="text-sm font-medium text-foreground">
              {currentMenu?.label}
            </div>
          </div>
          <div className="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-base text-foreground select-none md:right-2.5">
            {currentMenu?.icon}
          </div>
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
        >
          <PickerRadioGroup
            value={currentMenu?.value}
            onValueChange={(value) => {
              const isTranslucent =
                value === "translucent" || value === "translucent-inverted"
              setParams({
                menuColor: value as MenuColorValue,
                ...(isTranslucent && { menuAccent: "subtle" }),
              })
            }}
          >
            {MENU_GROUPS.map((group) => (
              <PickerGroup key={group.label}>
                <PickerLabel>{group.label}</PickerLabel>
                {group.items.map((menu) => (
                  <PickerRadioItem
                    key={menu.value}
                    value={menu.value}
                    closeOnClick={isMobile}
                    disabled={isDark && !!group.inverted}
                  >
                    {menu.label}
                  </PickerRadioItem>
                ))}
              </PickerGroup>
            ))}
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="menuColor"
        className="absolute top-1/2 right-8 -translate-y-1/2"
      />
    </div>
  )
}
