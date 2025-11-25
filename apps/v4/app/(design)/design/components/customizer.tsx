"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import { cn } from "@/lib/utils"
import { FONTS } from "@/registry/fonts"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"
import { FieldGroup } from "@/registry/new-york-v4/ui/field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/registry/new-york-v4/ui/item"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import { PRESETS } from "@/registry/presets"
import { STYLES } from "@/registry/styles"
import { THEMES } from "@/registry/themes"
import { BaseColorPicker } from "@/app/(design)/design/components/base-color-picker"
import { FontPicker } from "@/app/(design)/design/components/font-picker"
import { IconLibraryPicker } from "@/app/(design)/design/components/icon-library-picker"
import { StylePicker } from "@/app/(design)/design/components/style-picker"
import { ThemePicker } from "@/app/(design)/design/components/theme-picker"
import { designSystemSearchParams } from "@/app/(design)/design/lib/search-params"

export function Customizer() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  const handleSelectPreset = React.useCallback(
    (preset: (typeof PRESETS)[number]) => {
      setParams({
        style: preset.style,
        baseColor: preset.baseColor,
        theme: preset.theme,
        iconLibrary: preset.iconLibrary,
        font: preset.font,
        custom: false,
      })
    },
    [setParams]
  )

  const handleSelectCustom = React.useCallback(() => {
    setParams({
      custom: true,
    })
  }, [setParams])

  return (
    <div className="z-10 flex w-56 flex-col gap-4 px-1">
      <Card className="gap-0 rounded-xl py-0">
        <CardHeader className="gap-0 border-b px-3 py-2.5!">
          <CardTitle className="text-sm font-medium">Presets</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <FieldGroup className="flex flex-col gap-3">
            {PRESETS.map((preset, index) => {
              const isActive =
                !params.custom &&
                preset.style === params.style &&
                preset.theme === params.theme &&
                preset.iconLibrary === params.iconLibrary &&
                preset.font === params.font

              return (
                <Button
                  key={index}
                  variant="outline"
                  data-active={isActive}
                  className="data-[state=open]:bg-accent/50 data-[active=true]:border-primary ring-primary flex h-auto flex-col items-start justify-start p-0 shadow-none data-[active=true]:ring-1"
                  onClick={() => handleSelectPreset(preset)}
                >
                  <Item size="sm" className="w-full px-2.5 py-2">
                    <ItemContent className="items-start gap-0.5">
                      <ItemTitle className="text-xs font-medium">
                        {preset.title}
                      </ItemTitle>
                      <ItemDescription className="line-clamp-1 text-pretty">
                        {preset.iconLibrary} / {preset.font}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </Button>
              )
            })}
            <Button
              variant="outline"
              data-active={params.custom}
              className="data-[state=open]:bg-accent/50 data-[active=true]:border-primary ring-primary flex h-auto flex-col items-start justify-start p-0 shadow-none data-[active=true]:ring-1"
              onClick={handleSelectCustom}
            >
              <Item size="sm" className="w-full px-2.5 py-2">
                <ItemContent className="items-start gap-0.5">
                  <ItemTitle className="text-xs font-medium">Custom</ItemTitle>
                  <ItemDescription>Custom configuration</ItemDescription>
                </ItemContent>
              </Item>
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>
      {params.custom && (
        <Card className="gap-0 rounded-xl py-0">
          <CardHeader className="gap-0 border-b px-3 py-2.5!">
            <CardTitle className="text-sm font-medium">Customize</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <FieldGroup className="flex flex-col gap-3">
              <StylePicker styles={STYLES} />
              <BaseColorPicker />
              <ThemePicker themes={THEMES} />
              <IconLibraryPicker />
              <FontPicker fonts={FONTS} />
            </FieldGroup>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function CustomizerItem({
  title,
  description,
  icon,
  children,
  open,
  onOpenChange,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  children?: React.ReactNode
} & Pick<React.ComponentProps<typeof Popover>, "open" | "onOpenChange">) {
  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="data-[state=open]:bg-accent/50 flex h-auto flex-col items-start justify-start p-0 shadow-none"
          >
            <Item size="sm" className="w-full px-2.5 py-2">
              <ItemContent className="items-start gap-0.5">
                <ItemTitle className="text-xs font-medium">{title}</ItemTitle>
                {description && (
                  <ItemDescription>{description}</ItemDescription>
                )}
              </ItemContent>
              <ItemActions className="text-muted-foreground justify-end">
                {icon}
              </ItemActions>
            </Item>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="rounded-xl p-0"
          side="right"
          align="start"
          alignOffset={-24}
          sideOffset={24}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="border-b px-3 py-2.5">
            <div className="text-sm font-medium">{title}</div>
          </div>
          <div className="pt-3 pb-1">{children}</div>
        </PopoverContent>
      </Popover>
      <div
        data-open={open}
        className="fixed inset-0 z-50 hidden bg-transparent data-[open=true]:block"
        onClick={() => onOpenChange?.(false)}
      />
    </>
  )
}

export function CustomizerPicker({
  children,
  value,
  currentValue,
  open,
  showSearch = false,
  ...props
}: {
  children: React.ReactNode
  value?: string
  currentValue?: string | null
  open?: boolean
  showSearch?: boolean
} & React.ComponentProps<typeof Command>) {
  const [previousValue, setPreviousValue] = React.useState<string | null>(
    currentValue ?? null
  )

  React.useEffect(() => {
    if (currentValue) {
      setPreviousValue(currentValue)
    }
  }, [currentValue])

  const commandValue = React.useMemo(() => {
    if (value !== undefined) {
      return value
    }
    if (open && previousValue) {
      return previousValue
    }
    return undefined
  }, [value, open, previousValue])

  return (
    <Command value={commandValue} {...props}>
      {showSearch && (
        <div className="bg-popover *:data-[slot=command-input-wrapper]:bg-input/40 *:data-[slot=command-input-wrapper]:border-input px-3 pt-0 pb-2 *:data-[slot=command-input-wrapper]:h-8 *:data-[slot=command-input-wrapper]:rounded-md *:data-[slot=command-input-wrapper]:border *:data-[slot=command-input-wrapper]:px-2">
          <CommandInput placeholder="Search" />
        </div>
      )}
      <CommandList className="no-scrollbar scroll-pt-2 scroll-pb-1.5">
        <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
          No results found
        </CommandEmpty>
        {children}
      </CommandList>
    </Command>
  )
}

export function CustomizerPickerGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandGroup>) {
  return (
    <CommandGroup
      className={cn("px-3 pt-px *:[div]:flex *:[div]:flex-col", className)}
      {...props}
    />
  )
}

export function CustomizerPickerItem({
  isActive,
  className,
  children,
  ...props
}: {
  isActive: boolean
  className?: string
  children: React.ReactNode
} & React.ComponentProps<typeof CommandItem>) {
  return (
    <CommandItem
      data-active={isActive}
      className={cn(
        "group/command-item data-[selected=true]:bg-accent/50 data-[selected=true]:text-accent-foreground ring-border px-2 py-1.5 data-[selected=true]:ring-1",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  )
}
