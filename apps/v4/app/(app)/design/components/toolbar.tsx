"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import { iconLibraries } from "shadcn/icons"
import { RegistryItem } from "shadcn/schema"

import { fonts, type Font } from "@/registry/fonts"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/registry/new-york-v4/ui/field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/registry/new-york-v4/ui/item"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york-v4/ui/native-select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"
import { styles, type Style } from "@/registry/styles"
import { themes, type Theme } from "@/registry/themes"
import { ItemPicker } from "@/app/(app)/design/components/item-picker"
import { StylePicker } from "@/app/(app)/design/components/style-picker"
import { designSystemSearchParams } from "@/app/(app)/design/lib/search-params"

export function Toolbar({ items }: { items: RegistryItem[] }) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  return (
    <>
      <Card className="fixed top-20 left-6 z-10 w-64 gap-0 rounded-[12px] py-0 shadow-sm">
        <CardHeader className="gap-0 border-b px-4 py-3!">
          <CardTitle className="text-sm font-medium">Design</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <FieldGroup className="flex flex-col gap-4">
            <ItemPicker items={items} />
            <StylePicker styles={styles} />
            <Field>
              <FieldLabel htmlFor="style">Style</FieldLabel>
            </Field>
            <Field>
              <FieldLabel htmlFor="theme">Theme</FieldLabel>
              <NativeSelect
                id="theme"
                value={params.theme}
                size="sm"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setParams({ theme: e.target.value as Theme["name"] })
                }
              >
                {themes.map((theme) => (
                  <NativeSelectOption key={theme.name} value={theme.name}>
                    {theme.title}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="iconLibrary">Icon Library</FieldLabel>
              <NativeSelect
                id="iconLibrary"
                value={params.iconLibrary}
                size="sm"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setParams({
                    iconLibrary: e.target.value as keyof typeof iconLibraries,
                  })
                }
              >
                {(
                  Object.keys(iconLibraries) as Array<
                    keyof typeof iconLibraries
                  >
                ).map((key) => {
                  const iconLibrary = iconLibraries[key]
                  return (
                    <NativeSelectOption
                      key={iconLibrary.name}
                      value={iconLibrary.name}
                    >
                      {iconLibrary.title}
                    </NativeSelectOption>
                  )
                })}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="font">Font</FieldLabel>
              <NativeSelect
                id="font"
                value={params.font}
                size="sm"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setParams({ font: e.target.value as Font["value"] })
                }
              >
                {fonts.map((font) => (
                  <NativeSelectOption key={font.value} value={font.value}>
                    {font.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </>
  )
}

export function ToolbarItem({
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
            <Item size="sm" className="w-full px-3 py-2.5">
              <ItemContent className="items-start gap-0.5">
                <ItemTitle className="text-xs font-medium">{title}</ItemTitle>
                {description && (
                  <ItemDescription>{description}</ItemDescription>
                )}
              </ItemContent>
              <ItemActions className="justify-end">{icon}</ItemActions>
            </Item>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="rounded-[12px] p-2 shadow-xl"
          side="right"
          align="start"
          sideOffset={24}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {children}
        </PopoverContent>
      </Popover>
      <div
        data-open={open}
        className="fixed inset-0 hidden bg-transparent data-[open=true]:block"
        onClick={() => onOpenChange?.(false)}
      />
    </>
  )
}
