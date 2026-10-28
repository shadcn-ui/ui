"use client"

import * as React from "react"
import { cn } from "cn"
import { flushSync } from "react-dom"

import { useMounted } from "@/hooks/use-mounted"
import { BASE_COLORS, type Theme, type ThemeName } from "@/registry/config"
import { IconPlaceholder } from "@/app/(app)/(create)/components/icon-placeholder"
import { LockButton } from "@/app/(app)/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerItem,
  PickerRadioGroup,
  PickerRadioItem,
  PickerSeparator,
  PickerTrigger,
} from "@/app/(app)/(create)/components/picker"
import { usePreviewOverride } from "@/app/(app)/(create)/components/preview-override"
import { normalizeHex } from "@/app/(app)/(create)/lib/custom-primary"
import { useDesignSystemSearchParams } from "@/app/(app)/(create)/lib/search-params"

const SWAP_TRANSITION =
  "transition-[opacity,filter,translate] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-opacity"
const SWAP_HIDDEN =
  "pointer-events-none opacity-0 blur-[2px] motion-reduce:translate-x-0 motion-reduce:blur-none"
const ICON_TRANSITION =
  "col-start-1 row-start-1 transition-[opacity,scale,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-opacity"
const ICON_HIDDEN =
  "scale-25 opacity-0 blur-xs motion-reduce:scale-100 motion-reduce:blur-none"

export function ThemePicker({
  themes,
  isMobile,
  anchorRef,
}: {
  themes: readonly Theme[]
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const mounted = useMounted()
  const [params, setParams] = useDesignSystemSearchParams()
  const { setOverride, clearOverride } = usePreviewOverride()
  const [isEditing, setIsEditing] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const currentTheme = React.useMemo(
    () => themes.find((theme) => theme.name === params.theme),
    [themes, params.theme]
  )

  const currentThemeIsBaseColor = React.useMemo(
    () => BASE_COLORS.find((baseColor) => baseColor.name === params.theme),
    [params.theme]
  )

  const primary = params.primary
  const draftHex = normalizeHex(draft)
  const mode = isEditing ? "editing" : primary ? "custom" : "idle"
  const action = isEditing
    ? draft === ""
      ? "cancel"
      : "apply"
    : primary
      ? "remove"
      : "add"

  const startEditing = () => {
    clearOverride()
    flushSync(() => {
      setDraft(primary ? `#${primary.toUpperCase()}` : "")
      setIsEditing(true)
    })
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  const confirmDraft = () => {
    if (!draftHex) {
      return
    }

    clearOverride()
    setParams({ theme: params.baseColor as ThemeName, primary: draftHex })
    setIsEditing(false)
  }

  const previewPrimary = () => {
    setOverride({ theme: params.baseColor as ThemeName, primary })
  }

  const removePrimary = () => {
    setParams({ primary: null })
  }

  return (
    <div className="group/picker relative">
      <Picker
        onOpenChange={(open) => {
          setIsEditing(false)
          if (!open) {
            clearOverride()
          }
        }}
      >
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-xs text-muted-foreground">Theme</div>
            <div className="text-sm font-medium text-foreground">
              {primary ? `#${primary.toUpperCase()}` : currentTheme?.title}
            </div>
          </div>
          {mounted && (
            <div
              style={
                {
                  "--color": primary
                    ? `#${primary}`
                    : currentTheme?.cssVars?.dark?.[
                        currentThemeIsBaseColor ? "muted-foreground" : "primary"
                      ],
                } as React.CSSProperties
              }
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 rounded-full bg-(--color) transition-[background-color] duration-200 select-none md:right-2.5"
            />
          )}
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
          className="max-h-92"
          onMouseLeave={clearOverride}
        >
          <PickerRadioGroup
            value={primary ? "" : currentTheme?.name}
            onValueChange={(value) => {
              setParams({ theme: value as ThemeName, primary: null })
            }}
            onItemPreview={
              isMobile
                ? undefined
                : (value) =>
                    setOverride({ theme: value as ThemeName, primary: null })
            }
          >
            <PickerGroup className="flex items-center gap-1">
              <div className="grid min-w-0 flex-1">
                <div
                  inert={mode === "editing"}
                  className={cn(
                    "col-start-1 row-start-1",
                    SWAP_TRANSITION,
                    mode === "editing" && cn(SWAP_HIDDEN, "-translate-x-3")
                  )}
                >
                  {primary ? (
                    <PickerItem
                      closeOnClick={false}
                      onClick={startEditing}
                      onMouseMove={isMobile ? undefined : previewPrimary}
                      onFocus={isMobile ? undefined : previewPrimary}
                      className="pr-8"
                    >
                      <span
                        style={{ backgroundColor: `#${primary}` }}
                        className="size-3.5 shrink-0 rounded-full outline-1 -outline-offset-1 outline-white/20"
                      />
                      <span className="font-mono tabular-nums">
                        #{primary.toUpperCase()}
                      </span>
                      <span className="pointer-events-none absolute right-2 flex items-center justify-center">
                        <IconPlaceholder
                          lucide="CheckIcon"
                          tabler="IconCheck"
                          hugeicons="Tick02Icon"
                          phosphor="CheckIcon"
                          remixicon="RiCheckLine"
                          className="size-4 pointer-coarse:size-5"
                        />
                      </span>
                    </PickerItem>
                  ) : (
                    themes
                      .filter((theme) =>
                        BASE_COLORS.find(
                          (baseColor) => baseColor.name === theme.name
                        )
                      )
                      .map((theme) => {
                        return (
                          <PickerRadioItem
                            key={theme.name}
                            value={theme.name}
                            closeOnClick={isMobile}
                          >
                            {theme.title}
                          </PickerRadioItem>
                        )
                      })
                  )}
                </div>
                <form
                  inert={mode !== "editing"}
                  onSubmit={(event) => {
                    event.preventDefault()
                    confirmDraft()
                  }}
                  className={cn(
                    "col-start-1 row-start-1",
                    SWAP_TRANSITION,
                    mode !== "editing" && cn(SWAP_HIDDEN, "translate-x-3")
                  )}
                >
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      // Keep typeahead and arrow keys from moving menu focus.
                      event.stopPropagation()
                      if (event.key === "Escape") {
                        event.preventDefault()
                        setIsEditing(false)
                      }
                    }}
                    placeholder="#AABBCC"
                    aria-label="Custom primary color in hex"
                    aria-invalid={draft !== "" && !draftHex}
                    maxLength={7}
                    spellCheck={false}
                    autoComplete="off"
                    className="h-8 w-full rounded-lg bg-white/5 px-2 font-mono text-sm text-neutral-100 uppercase tabular-nums ring-1 ring-white/10 outline-none placeholder:text-neutral-500 focus-visible:ring-white/30 aria-invalid:ring-red-400/60 pointer-coarse:h-11 pointer-coarse:text-base"
                  />
                </form>
              </div>
              <PickerItem
                closeOnClick={false}
                disabled={action === "apply" && !draftHex}
                onClick={
                  {
                    add: startEditing,
                    apply: confirmDraft,
                    cancel: () => setIsEditing(false),
                    remove: removePrimary,
                  }[action]
                }
                aria-label={
                  {
                    add: "Add custom primary color",
                    apply: "Apply custom primary color",
                    cancel: "Cancel custom primary color",
                    remove: "Remove custom primary color",
                  }[action]
                }
                className="grid size-8 shrink-0 place-items-center bg-white/10 p-0 transition-[scale,background-color] duration-150 ease-out active:scale-[0.96] motion-reduce:active:scale-100 pointer-coarse:size-11 pointer-coarse:p-0"
              >
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                  phosphor="PlusIcon"
                  remixicon="RiAddLine"
                  className={cn(
                    ICON_TRANSITION,
                    action !== "add" && ICON_HIDDEN
                  )}
                />
                <IconPlaceholder
                  lucide="CheckIcon"
                  tabler="IconCheck"
                  hugeicons="Tick02Icon"
                  phosphor="CheckIcon"
                  remixicon="RiCheckLine"
                  className={cn(
                    ICON_TRANSITION,
                    action !== "apply" && ICON_HIDDEN
                  )}
                />
                <IconPlaceholder
                  lucide="XIcon"
                  tabler="IconX"
                  hugeicons="Cancel01Icon"
                  phosphor="XIcon"
                  remixicon="RiCloseLine"
                  className={cn(
                    ICON_TRANSITION,
                    action !== "cancel" && action !== "remove" && ICON_HIDDEN
                  )}
                />
              </PickerItem>
            </PickerGroup>
            <PickerSeparator />
            <PickerGroup>
              {themes
                .filter(
                  (theme) =>
                    !BASE_COLORS.find(
                      (baseColor) => baseColor.name === theme.name
                    )
                )
                .map((theme) => {
                  return (
                    <PickerRadioItem
                      key={theme.name}
                      value={theme.name}
                      closeOnClick={isMobile}
                    >
                      {theme.title}
                    </PickerRadioItem>
                  )
                })}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="theme"
        className="absolute top-1/2 right-8 -translate-y-1/2"
      />
    </div>
  )
}
