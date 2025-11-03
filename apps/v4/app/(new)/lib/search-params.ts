import {
  createParser,
  createSearchParamsCache,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

import { iconLibraries } from "@/registry/icon-libraries"
import { themes, type Theme } from "@/app/(new)/lib/themes"

export const parseAsIconLibrary = createParser<keyof typeof iconLibraries>({
  parse(queryValue) {
    if (typeof queryValue === "string" && queryValue.trim() !== "") {
      const trimmed = queryValue.trim()
      return trimmed in iconLibraries
        ? (trimmed as keyof typeof iconLibraries)
        : null
    }
    return null
  },
  serialize(value) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim()
    }
    throw new Error("Invalid value for serialization")
  },
})

export const parseAsTheme = createParser<Theme["name"]>({
  parse(queryValue) {
    if (typeof queryValue === "string" && queryValue.trim() !== "") {
      const trimmed = queryValue.trim()
      const validTheme = themes.find((theme) => theme.name === trimmed)
      return validTheme ? (validTheme.name as Theme["name"]) : null
    }
    return null
  },
  serialize(value) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim()
    }
    throw new Error("Invalid value for serialization")
  },
})

export const designSystemSearchParams = {
  iconLibrary: parseAsIconLibrary.withDefault("lucide"),
  item: parseAsString.withDefault(""),
  theme: parseAsTheme.withDefault("blue"),
}

export const canvaSearchParams = {
  zoom: parseAsFloat.withDefault(0.85),
  scrollLeft: parseAsInteger.withDefault(0),
  scrollTop: parseAsInteger.withDefault(0),
}

export const designSystemSearchParamsCache = createSearchParamsCache(
  designSystemSearchParams
)

export const canvaSearchParamsCache = createSearchParamsCache(canvaSearchParams)

export type DesignSystemSearchParams = Awaited<
  ReturnType<typeof designSystemSearchParamsCache.parse>
>

export type CanvaSearchParams = Awaited<
  ReturnType<typeof canvaSearchParamsCache.parse>
>
