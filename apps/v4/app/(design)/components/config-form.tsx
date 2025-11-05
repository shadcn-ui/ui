"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"
import { RegistryItem } from "shadcn/schema"

import { iconLibraries } from "@/registry/icon-libraries"
import { Field, FieldGroup, FieldLabel } from "@/registry/new-york-v4/ui/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york-v4/ui/native-select"
import { style, type Style } from "@/registry/styles"
import { themes, type Theme } from "@/registry/themes"
import { CommandMenu } from "@/app/(design)/components/command-menu"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function ConfigForm({ items }: { items: RegistryItem[] }) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  return (
    <div className="bg-background rounded-lg border p-4">
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
      </FieldGroup>
    </div>
  )
}
