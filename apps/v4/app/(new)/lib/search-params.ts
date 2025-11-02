import {
  createParser,
  createSearchParamsCache,
  parseAsFloat,
  parseAsInteger,
} from "nuqs/server"

import { iconLibraries } from "@/registry/icon-libraries"
import {
  designSystemStyles,
  type DesignSystemStyle,
} from "@/app/(new)/lib/style"

export const parseAsStyle = createParser<DesignSystemStyle["name"]>({
  parse(queryValue) {
    if (typeof queryValue === "string" && queryValue.trim() !== "") {
      const trimmed = queryValue.trim()
      const validStyle = designSystemStyles.find(
        (style) => style.name === trimmed
      )
      return validStyle ? (validStyle.name as DesignSystemStyle["name"]) : null
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

export const designSystemSearchParams = {
  style: parseAsStyle.withDefault("radix-nova"),
  iconLibrary: parseAsIconLibrary.withDefault("lucide"),
  zoom: parseAsFloat.withDefault(1),
  scrollLeft: parseAsInteger.withDefault(0),
  scrollTop: parseAsInteger.withDefault(0),
}

export const designSystemSearchParamsCache = createSearchParamsCache(
  designSystemSearchParams
)

export const styleSearchParamsCache = createSearchParamsCache({
  style: parseAsStyle.withDefault("radix-nova"),
})

export type DesignSystemSearchParams = Awaited<
  ReturnType<typeof designSystemSearchParamsCache.parse>
>

export function getDesignSystemParamsCacheKey(
  params: DesignSystemSearchParams
) {
  return params.style
}
