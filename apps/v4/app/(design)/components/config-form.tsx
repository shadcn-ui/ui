"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

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
import { themes, type Theme } from "@/registry/themes"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function ConfigForm() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
  })

  return (
    <div className="grid w-auto grid-cols-2 gap-2">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="theme" className="sr-only">
          Theme
        </FieldLabel>
        <Select
          value={params.theme}
          onValueChange={(value: Theme["name"]) => setParams({ theme: value })}
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
      <Field orientation="horizontal">
        <FieldLabel htmlFor="iconLibrary" className="sr-only">
          Icon Library
        </FieldLabel>
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
    </div>
  )
}
