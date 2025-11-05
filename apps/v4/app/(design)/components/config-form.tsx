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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
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
          <Select
            value={params.style}
            onValueChange={(value: Style["name"]) =>
              setParams({ style: value })
            }
          >
            <SelectTrigger id="style" className="w-full" size="sm">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {style.map((style) => (
                <SelectItem key={style.name} value={style.name}>
                  {style.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="theme">Theme</FieldLabel>
          <Select
            value={params.theme}
            onValueChange={(value: Theme["name"]) =>
              setParams({ theme: value })
            }
          >
            <SelectTrigger id="theme" className="w-full" size="sm">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme.name} value={theme.name}>
                  {theme.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
