"use client"

import * as React from "react"
import { Menu02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTheme } from "next-themes"

import { useMounted } from "@/hooks/use-mounted"
import { type MenuColorValue } from "@/registry/config"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerLabel,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

type ColorChoice = "default" | "inverted"
type TranslucentChoice = "yes" | "no"

type MenuItemConfig = {
  value: MenuColorValue
  label: string
}

function getMenuColorValue(
  color: ColorChoice,
  translucent: boolean
): MenuColorValue {
  if (color === "default") {
    return translucent ? "translucent" : "default"
  }
  return translucent ? "translucent-inverted" : "inverted"
}

const MENU_ITEMS: MenuItemConfig[] = [
  { value: "default", label: "Default" },
  { value: "translucent", label: "Translucent" },
  { value: "inverted", label: "Inverted" },
  { value: "translucent-inverted", label: "Inverted (translucent)" },
]
const ALL_OPTIONS = MENU_ITEMS

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
  const colorChoice: ColorChoice =
    params.menuColor === "inverted" ||
    params.menuColor === "translucent-inverted"
      ? "inverted"
      : "default"
  const translucentChoice: TranslucentChoice =
    params.menuColor === "translucent" ||
    params.menuColor === "translucent-inverted"
      ? "yes"
      : "no"

  const setColor = (color: ColorChoice) => {
    const nextMenuColor = getMenuColorValue(color, translucentChoice === "yes")
    setParams({
      menuColor: nextMenuColor,
      ...(translucentChoice === "yes" && { menuAccent: "subtle" }),
    })
  }

  const setTranslucent = (choice: TranslucentChoice) => {
    const isTranslucent = choice === "yes"
    const nextMenuColor = getMenuColorValue(colorChoice, isTranslucent)
    setParams({
      menuColor: nextMenuColor,
      ...(isTranslucent && { menuAccent: "subtle" }),
    })
  }

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-xs text-muted-foreground">Menu </div>
            <div className="text-sm font-medium text-foreground">
              {currentMenu?.label}
            </div>
          </div>
          <div className="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-base text-foreground select-none md:right-2.5">
            <HugeiconsIcon
              icon={Menu02Icon}
              strokeWidth={2}
              className="size-4"
            />
          </div>
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
        >
          <PickerGroup>
            <PickerLabel>Color</PickerLabel>
            <PickerRadioGroup
              value={colorChoice}
              onValueChange={(value) => {
                setColor(value as ColorChoice)
              }}
            >
              <PickerRadioItem value="default" closeOnClick={isMobile}>
                Default
              </PickerRadioItem>
              <PickerRadioItem
                value="inverted"
                closeOnClick={isMobile}
                disabled={isDark}
              >
                Inverted
              </PickerRadioItem>
            </PickerRadioGroup>
          </PickerGroup>
          <PickerSeparator />
          <PickerGroup>
            <PickerLabel>Translucent</PickerLabel>
            <PickerRadioGroup
              value={translucentChoice}
              onValueChange={(value) => {
                setTranslucent(value as TranslucentChoice)
              }}
            >
              <PickerRadioItem value="yes" closeOnClick={isMobile}>
                Yes
              </PickerRadioItem>
              <PickerRadioItem value="no" closeOnClick={isMobile}>
                No
              </PickerRadioItem>
            </PickerRadioGroup>
          </PickerGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="menuColor"
        className="absolute top-1/2 right-8 -translate-y-1/2"
      />
    </div>
  )
}
