"use client"

import * as React from "react"
import { RegistryItem } from "shadcn/schema"

import { fonts } from "@/registry/fonts"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
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
import { styles } from "@/registry/styles"
import { themes } from "@/registry/themes"
import { FontPicker } from "@/app/(app)/design/components/font-picker"
import { IconLibraryPicker } from "@/app/(app)/design/components/icon-library-picker"
import { ItemPicker } from "@/app/(app)/design/components/item-picker"
import { StylePicker } from "@/app/(app)/design/components/style-picker"
import { ThemePicker } from "@/app/(app)/design/components/theme-picker"

export function Toolbar({ items }: { items: RegistryItem[] }) {
  return (
    <>
      <Card className="fixed top-20 left-6 z-10 w-64 gap-0 rounded-[12px] border-none py-0 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <CardHeader className="gap-0 border-b px-4 py-3.5!">
          <CardTitle className="text-sm font-medium">Design</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <FieldGroup className="flex flex-col gap-4">
            <ItemPicker items={items} />
            <StylePicker styles={styles} />
            <ThemePicker themes={themes} />
            <IconLibraryPicker />
            <FontPicker fonts={fonts} />
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
          className="rounded-[12px] px-4 py-0 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          side="right"
          align="start"
          sideOffset={24}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="-mx-4 border-b px-4 py-3.5">
            <div className="text-sm font-medium">{title}</div>
          </div>
          <div>{children}</div>
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
