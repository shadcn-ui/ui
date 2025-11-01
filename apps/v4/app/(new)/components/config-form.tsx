"use client"

import {
  COMPONENT_LIBRARIES,
  type ComponentLibrary,
} from "@/registry/component-libraries"
import { Field, FieldGroup, FieldLabel } from "@/registry/new-york-v4/ui/field"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/registry/new-york-v4/ui/native-select"
import { useDesignSystemSearchParams } from "@/app/(new)/hooks/use-design-system-search-params"
import { DesignSystemStyle, designSystemStyles } from "@/app/(new)/lib/style"

export function ConfigForm() {
  const [params, setParams] = useDesignSystemSearchParams()

  const currentStyle = designSystemStyles.find(
    (style) => style.name === params.style
  )
  const currentLibrary = currentStyle?.componentLibrary ?? "radix"

  const handleLibraryChange = (libraryName: ComponentLibrary["name"]) => {
    const availableStyles = designSystemStyles.filter(
      (style) => style.componentLibrary === libraryName
    )
    if (availableStyles.length > 0) {
      setParams({ style: availableStyles[0].name })
    }
  }

  return (
    <div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="library">Component Library</FieldLabel>
          <NativeSelect
            id="library"
            value={currentLibrary}
            onChange={(e) =>
              handleLibraryChange(e.target.value as ComponentLibrary["name"])
            }
          >
            {COMPONENT_LIBRARIES.map((lib) => (
              <NativeSelectOption key={lib.name} value={lib.name}>
                {lib.title}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="style">Style</FieldLabel>
          <NativeSelect
            id="style"
            value={params.style}
            onChange={(e) =>
              setParams({ style: e.target.value as DesignSystemStyle["name"] })
            }
          >
            {designSystemStyles
              .filter((style) => style.componentLibrary === currentLibrary)
              .map((s) => (
                <NativeSelectOption key={s.name} value={s.name}>
                  {s.title}
                </NativeSelectOption>
              ))}
          </NativeSelect>
        </Field>
      </FieldGroup>
    </div>
  )
}
