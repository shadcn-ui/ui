"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import { iconLibraries } from "@/registry/icon-libraries"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
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
    <Card className="gap-4 py-0">
      <CardHeader className="border-b p-4 pb-2!">
        <CardTitle className="text-sm">Design System</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="theme">Theme</FieldLabel>
            <Select
              value={params.theme}
              onValueChange={(value: Theme["name"]) =>
                setParams({ theme: value })
              }
            >
              <SelectTrigger id="theme">
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
      </CardContent>
    </Card>
  )
}
