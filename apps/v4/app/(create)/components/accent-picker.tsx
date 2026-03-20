"use client"

import { MENU_ACCENTS, type MenuAccentValue } from "@/registry/config"
import { useCustomizerLayout } from "@/app/(create)/components/customizer-layout"
import { LockButton } from "@/app/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerValueTrigger,
} from "@/app/(create)/components/picker"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function MenuAccentPicker({
  isMobile,
  anchorRef,
  collapsed = false,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
  collapsed?: boolean
}) {
  const [params, setParams] = useDesignSystemSearchParams()
  const { desktopPickerSide } = useCustomizerLayout()

  const currentAccent = MENU_ACCENTS.find(
    (accent) => accent.value === params.menuAccent
  )

  return (
    <div className="group/picker relative pr-3 md:pr-0">
      <Picker>
        <PickerValueTrigger
          label="Menu Accent"
          value={currentAccent?.label}
          valueText={currentAccent?.label}
          indicator={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="128"
              height="128"
              viewBox="0 0 24 24"
              fill="none"
              className="size-4 text-foreground"
            >
              <path
                d="M19 12.1294L12.9388 18.207C11.1557 19.9949 10.2641 20.8889 9.16993 20.9877C8.98904 21.0041 8.80705 21.0041 8.62616 20.9877C7.53195 20.8889 6.64039 19.9949 4.85726 18.207L2.83687 16.1811C1.72104 15.0622 1.72104 13.2482 2.83687 12.1294M19 12.1294L10.9184 4.02587M19 12.1294H2.83687M10.9184 4.02587L2.83687 12.1294M10.9184 4.02587L8.89805 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-accent={currentAccent?.value}
                className="fill-muted-foreground/30 data-[accent=bold]:fill-foreground"
              ></path>
              <path
                d="M22 20C22 21.1046 21.1046 22 20 22C18.8954 22 18 21.1046 18 20C18 18.8954 20 17 20 17C20 17 22 18.8954 22 20Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-accent={currentAccent?.value}
                className="fill-muted-foreground/30 data-[accent=bold]:fill-foreground"
              ></path>
            </svg>
          }
          collapsed={collapsed}
        />
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : desktopPickerSide}
          align={isMobile ? "center" : "start"}
        >
          <PickerRadioGroup
            value={currentAccent?.value}
            onValueChange={(value) => {
              setParams({ menuAccent: value as MenuAccentValue })
            }}
          >
            <PickerGroup>
              {MENU_ACCENTS.map((accent) => (
                <PickerRadioItem
                  key={accent.value}
                  value={accent.value}
                  closeOnClick={isMobile}
                  disabled={
                    accent.value === "bold" &&
                    (params.menuColor === "default-translucent" ||
                      params.menuColor === "inverted-translucent")
                  }
                >
                  {accent.label}
                </PickerRadioItem>
              ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      {!collapsed ? (
        <LockButton
          param="menuAccent"
          className="absolute top-1/2 right-8 -translate-y-1/2"
        />
      ) : null}
    </div>
  )
}
