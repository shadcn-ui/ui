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
import {
  isTranslucentMenuColor,
  useDesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

type ColorChoice = "default" | "inverted"
type SurfaceChoice = "solid" | "translucent"

function getMenuColorValue(
  color: ColorChoice,
  translucent: boolean
): MenuColorValue {
  if (color === "default") {
    return translucent ? "default-translucent" : "default"
  }

  return translucent ? "inverted-translucent" : "inverted"
}

const MENU_OPTIONS: { value: MenuColorValue; label: string }[] = [
  { value: "default", label: "Default / Solid" },
  { value: "default-translucent", label: "Default / Translucent" },
  { value: "inverted", label: "Inverted / Solid" },
  { value: "inverted-translucent", label: "Inverted / Translucent" },
]

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
  const lastSolidMenuAccentRef = React.useRef(params.menuAccent)
  const isDark = mounted && resolvedTheme === "dark"
  const currentMenu = MENU_OPTIONS.find(
    (menu) => menu.value === params.menuColor
  )
  const colorChoice: ColorChoice =
    params.menuColor === "inverted" ||
    params.menuColor === "inverted-translucent"
      ? "inverted"
      : "default"
  const surfaceChoice: SurfaceChoice =
    params.menuColor === "default-translucent" ||
    params.menuColor === "inverted-translucent"
      ? "translucent"
      : "solid"

  React.useEffect(() => {
    if (surfaceChoice === "solid") {
      lastSolidMenuAccentRef.current = params.menuAccent
    }
  }, [params.menuAccent, surfaceChoice])

  const setColor = (color: ColorChoice) => {
    const nextMenuColor = getMenuColorValue(
      color,
      surfaceChoice === "translucent"
    )

    setParams({
      menuColor: nextMenuColor,
      ...(isTranslucentMenuColor(nextMenuColor) && { menuAccent: "subtle" }),
    })
  }

  const setSurface = (choice: SurfaceChoice) => {
    const isTranslucent = choice === "translucent"
    const nextMenuColor = getMenuColorValue(colorChoice, isTranslucent)

    setParams({
      menuColor: nextMenuColor,
      menuAccent: isTranslucent ? "subtle" : lastSolidMenuAccentRef.current,
    })
  }

  return (
    <div className="group/picker relative">
      <Picker>
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-xs text-muted-foreground">Menu</div>
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
            <PickerLabel>Appearance</PickerLabel>
            <PickerRadioGroup
              value={surfaceChoice}
              onValueChange={(value) => {
                setSurface(value as SurfaceChoice)
              }}
            >
              <PickerRadioItem value="solid" closeOnClick={isMobile}>
                Solid
              </PickerRadioItem>
              <PickerRadioItem value="translucent" closeOnClick={isMobile}>
                Translucent
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
