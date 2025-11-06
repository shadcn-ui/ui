"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import { iconLibraries } from "shadcn/icons"
import { RegistryItem } from "shadcn/schema"

import { cn } from "@/lib/utils"
import { fonts, type Font } from "@/registry/fonts"
import { Field, FieldGroup, FieldLabel } from "@/registry/new-york-v4/ui/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york-v4/ui/native-select"
import { style, type Style } from "@/registry/styles"
import { themes, type Theme } from "@/registry/themes"
import { CommandMenu } from "@/app/(app)/design/components/command-menu"
import { designSystemSearchParams } from "@/app/(app)/design/lib/search-params"

export function ConfigForm({
  items,
  className,
  ...props
}: { items: RegistryItem[] } & React.ComponentProps<"div">) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  return (
    <div
      className={cn("bg-background rounded-lg border p-4", className)}
      {...props}
    >
      <FieldGroup>
        <CommandMenu items={items} />
        <Field>
          <FieldLabel htmlFor="style">Style</FieldLabel>
          <NativeSelect
            id="style"
            value={params.style}
            size="sm"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setParams({ style: e.target.value as Style["name"] })
            }
          >
            {style.map((style) => (
              <NativeSelectOption key={style.name} value={style.name}>
                {style.title}
              </NativeSelectOption>
            ))}
          </NativeSelect>
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
              Object.keys(iconLibraries) as Array<keyof typeof iconLibraries>
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
    </div>
  )
}
