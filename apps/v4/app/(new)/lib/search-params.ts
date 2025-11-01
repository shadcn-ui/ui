import { createParser, createSearchParamsCache } from "nuqs/server"

import {
  designSystemStyles,
  type DesignSystemStyle,
} from "@/app/(new)/lib/style"

const parseAsStyle = createParser<DesignSystemStyle["name"]>({
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

export const designSystemSearchParams = {
  style: parseAsStyle.withDefault("radix-nova"),
}

export const designSystemSearchParamsCache = createSearchParamsCache(
  designSystemSearchParams
)

export type DesignSystemSearchParams = Awaited<
  ReturnType<typeof designSystemSearchParamsCache.parse>
>

export function getDesignSystemParamsCacheKey(
  params: DesignSystemSearchParams
) {
  return params.style
}
