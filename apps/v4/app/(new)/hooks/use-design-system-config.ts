import { useQueryStates } from "nuqs"

import { designSystemSearchParams } from "@/app/(new)/lib/search-params"

export function useDesignSystemConfig() {
  return useQueryStates(designSystemSearchParams, {
    shallow: false,
  })
}
