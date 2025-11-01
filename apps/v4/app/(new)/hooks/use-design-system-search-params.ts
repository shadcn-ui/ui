import { useQueryStates } from "nuqs"

import { designSystemSearchParams } from "@/app/(new)/lib/search-params"

export function useDesignSystemSearchParams() {
  return useQueryStates(designSystemSearchParams, {
    shallow: false,
  })
}
