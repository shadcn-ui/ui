"use client"

import * as React from "react"
import { useQueryStates } from "nuqs"

import { COMPONENT_LIBRARIES } from "@/registry/component-libraries"
import { iconLibraries } from "@/registry/icon-libraries"
import { Field, FieldGroup, FieldLabel } from "@/registry/new-york-v4/ui/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york-v4/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { useDesignSystemConfig } from "@/app/(new)/hooks/use-design-system-config"
import { canvaSearchParams } from "@/app/(new)/lib/search-params"
import { DesignSystemStyle, designSystemStyles } from "@/app/(new)/lib/style"
import { Theme, themes } from "@/app/(new)/lib/themes"

export function ConfigForm() {
  const [params, setParams] = useDesignSystemConfig()
  const [canvaParams, setCanvaParams] = useQueryStates(canvaSearchParams)

  return (
    <div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="style">Component Library & Style</FieldLabel>
          <Select
            value={params.style}
            onValueChange={(value) =>
              setParams({ style: value as DesignSystemStyle["name"] })
            }
          >
            <SelectTrigger id="style">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {COMPONENT_LIBRARIES.map((library) => {
                const stylesForLibrary = designSystemStyles.filter(
                  (style) => style.componentLibrary === library.name
                )
                if (stylesForLibrary.length === 0) {
                  return null
                }
                return (
                  <SelectGroup key={library.name}>
                    <SelectLabel>{library.title}</SelectLabel>
                    {stylesForLibrary.map((style) => (
                      <SelectItem key={style.name} value={style.name}>
                        {style.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )
              })}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="theme">Theme</FieldLabel>
          <Select
            value={canvaParams.theme}
            onValueChange={(value) =>
              setCanvaParams({ theme: value as Theme["name"] })
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
    </div>
  )
}
